import React from "react";
import { SAMPLE_PARAGRAPHS } from "../../data/sampleParagraphs";
import ChallengeSection from "../ChallengeSection/ChallengeSection";
import Footer from "../Footer/Footer";
import Landing from "../Landing/Landing";
import Nav from "../Nav/Nav";
import "./App.css";

const TotalTime = 60;
const ServiceUrl = "https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=text";
const DefaultState = {
    selectedParagraph: "",
    timerStarted: false,
    timeRemaining: TotalTime,
    characters: 0,
    words: 0,
    wpm: 0,
    testInfo: []
}

class App extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = DefaultState;
    // }
    state = DefaultState;

    fetchNewParagraphFallback = () => {
        const data =
            SAMPLE_PARAGRAPHS[
            Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)
            ];
        const selectedParagraph = data.split("");
        const testInfo = selectedParagraph.map(selectedLetter => {
            return {
                testLetter: selectedLetter,
                status: "notAttempted",
            }
        });

        //this.setState({testInfo: testInfo});
        //if objet name is same as name of variable containing value then we can write like this
        this.setState({
            ...DefaultState,
            testInfo,
            selectedParagraph
        });
    }
    fetchNewParagraph = () => {
        fetch(ServiceUrl)
            .then(response => response.text())
            .then(data => {
                console.log(data);
                const selectedParagraph = data.split("");
                const testInfo = selectedParagraph.map(selectedLetter => {
                    return {
                        testLetter: selectedLetter,
                        status: "notAttempted",
                    }
                });

                //this.setState({testInfo: testInfo});
                //if objet name is same as name of variable containing value then we can write like this
                this.setState({
                    ...DefaultState,
                    testInfo,
                    selectedParagraph
                });
            })
    }

    componentDidMount() {
        //this.fetchNewParagraph();
        this.fetchNewParagraphFallback();
    }

    startTimer = () => {
        this.setState({ timerStarted: true })
        const timer = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                // Change the wpm 
                const timeSpent = TotalTime - this.state.timeRemaining;
                const wpm = timeSpent > 0 ?
                    (this.state.words / timeSpent) * TotalTime
                    : 0;
                this.setState({
                    timeRemaining: this.state.timeRemaining - 1,
                    wpm: parseInt(wpm),
                });
            } else {
                clearInterval(timer);
            }

        }, 1000)
    }

    startAgain = () => this.fetchNewParagraphFallback();
    //this.fetchNewParagraph(); 

    handleUserInput = (inputValue) => {
        if (!this.state.timerStarted)
            this.startTimer();
        /**
         * 1.Handle the underflow case - all the characters should be shown as not-attempted and early exit
         * 2.Handle the overflow case - early exit
         * 3.Handle the backspace 
         *          - mark the (index + 1) element as not attempted(irrespective of whether the index is less than zero) 
         *          - But dont forget to check the overflow case here
         *            (index + 1 -> out of bound, when the index === length - 1 )
         * 4.Update the status in the test info
         *          - Find out the last character in the inputvalue and it's index
         *          - Check if the character at same index in testInfo (state) matches or not
         *          - Yes -> "correct"
         *            No -> "incorrect"
         * 5.Irrespective of the case, characters, words and speed(wpm) can be updated
         *  */

        const characters = inputValue.length;
        const words = inputValue.split("").length;
        const index = characters - 1;

        if (index < 0) {
            this.setState({
                testInfo: [
                    {
                        testLetter: this.state.testInfo[0].testLetter,
                        status: "not attempted"
                    },
                    ...this.state.testInfo.slice(1),
                ],
                characters,
                words,
            });
            return;
        }

        if (index > this.state.selectedParagraph.length) {
            this.setState({ characters, words })
            return;
        }

        // Make a copy of testInfo
        const testInfo = this.state.testInfo;
        if (!(index === this.state.selectedParagraph.length - 1))
            testInfo[index + 1].status = "notAttempted";

        // check for the corret typed letter
        const isCorrect = inputValue[index] === testInfo[index].testLetter;

        //update the test info
        testInfo[index].status = isCorrect ? "correct" : "incorrect";

        //update the state
        this.setState({
            testInfo,
            words,
            characters
        })
    };

    render() {
        return (
            <div className="app">
                {/* Nav Section */}
                <Nav />
                {/* Landing Page */}
                <Landing />
                {/* Chalenge Section */}
                <ChallengeSection
                    selectedParagraph={this.state.selectedParagraph}
                    words={this.state.words}
                    characters={this.state.characters}
                    wpm={this.state.wpm}
                    timeRemaining={this.state.timeRemaining}
                    timerStarted={this.state.timerStarted}
                    testInfo={this.state.testInfo}
                    onInputChange={this.handleUserInput}
                    startAgain={this.startAgain}
                />
                {/* Footer */}
                <Footer />
            </div>
        )
    }
}

export default App;