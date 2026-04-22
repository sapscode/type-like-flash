import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_PARAGRAPHS } from '../../data/sampleParagraphs';
import ChallengeSection from '../ChallengeSection/ChallengeSection';
import Footer from '../Footer/Footer';
import Landing from '../Landing/Landing';
import Nav from '../Nav/Nav';
import './App.css';

const TotalTime = 60;
const ServiceUrl =
    'https://baconipsum.com/api/?type=all-meat&paras=3&start-with-lorem=1&format=text';

const App = () => {
    // State management using hooks
    const [selectedParagraph, setSelectedParagraph] = useState('');
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(TotalTime);
    const [characters, setCharacters] = useState(0);
    const [words, setWords] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [testInfo, setTestInfo] = useState([]);

    const timerIntervalRef = useRef(null);
    const wordsRef = useRef(0);

    // Reset state to initial values
    const resetState = useCallback(() => {
        setSelectedParagraph('');
        setTimerStarted(false);
        setTimeRemaining(TotalTime);
        setCharacters(0);
        setWords(0);
        setWpm(0);
        setTestInfo([]);
        wordsRef.current = 0;
    }, []);

    // Fetch paragraph from fallback data
    const fetchNewParagraphFallback = useCallback(() => {
        const data =
            SAMPLE_PARAGRAPHS[
                Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)
            ];
        const selectedParagraphArray = data.split('');
        const newTestInfo = selectedParagraphArray.map((selectedLetter) => ({
            testLetter: selectedLetter,
            status: 'notAttempted',
        }));

        setSelectedParagraph(selectedParagraphArray);
        setTestInfo(newTestInfo);
        resetState();
    }, [resetState]);

    // Fetch paragraph from API (currently unused in the original code)
    const fetchNewParagraph = useCallback(() => {
        fetch(ServiceUrl)
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
                const selectedParagraphArray = data.split('');
                const newTestInfo = selectedParagraphArray.map(
                    (selectedLetter) => ({
                        testLetter: selectedLetter,
                        status: 'notAttempted',
                    })
                );

                setSelectedParagraph(selectedParagraphArray);
                setTestInfo(newTestInfo);
                resetState();
            })
            .catch((error) => {
                console.error('Error fetching paragraph:', error);
                fetchNewParagraphFallback();
            });
    }, [resetState, fetchNewParagraphFallback]);

    // Initialize app with fallback paragraph on mount
    useEffect(() => {
        fetchNewParagraphFallback();
    }, [fetchNewParagraphFallback]);

    // Timer effect - runs when timer starts
    useEffect(() => {
        if (!timerStarted) return;

        timerIntervalRef.current = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 1) {
                    const newTimeRemaining = prevTime - 1;
                    const timeSpent = TotalTime - newTimeRemaining;
                    const newWpm =
                        timeSpent > 0
                            ? (wordsRef.current / timeSpent) * TotalTime
                            : 0;
                    setWpm(parseInt(newWpm));
                    return newTimeRemaining;
                } else {
                    // Timer reached 0
                    if (timerIntervalRef.current) {
                        clearInterval(timerIntervalRef.current);
                    }
                    return 0;
                }
            });
        }, 1000);

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [timerStarted]);

    // Start timer
    const startTimer = useCallback(() => {
        setTimerStarted(true);
    }, []);

    // Start again - reset and fetch new paragraph
    const startAgain = useCallback(() => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        fetchNewParagraphFallback();
    }, [fetchNewParagraphFallback]);

    // Handle user input
    const handleUserInput = useCallback(
        (inputValue) => {
            if (!timerStarted) {
                startTimer();
            }

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

            const charCount = inputValue.length;
            const wordCount = inputValue
                .split(' ')
                .filter((word) => word.length > 0).length;
            const index = charCount - 1;

            wordsRef.current = wordCount;

            if (index < 0) {
                setTestInfo((prevTestInfo) => [
                    {
                        testLetter: prevTestInfo[0]?.testLetter || '',
                        status: 'notAttempted',
                    },
                    ...prevTestInfo.slice(1),
                ]);
                setCharacters(charCount);
                setWords(wordCount);
                return;
            }

            if (index >= selectedParagraph.length) {
                setCharacters(charCount);
                setWords(wordCount);
                return;
            }

            // Create a copy of testInfo and update it
            setTestInfo((prevTestInfo) => {
                const newTestInfo = prevTestInfo.map((item, idx) => {
                    if (idx === index) {
                        const isCorrect = inputValue[index] === item.testLetter;
                        return {
                            ...item,
                            status: isCorrect ? 'correct' : 'incorrect',
                        };
                    }
                    if (
                        idx === index + 1 &&
                        index < selectedParagraph.length - 1
                    ) {
                        return {
                            ...item,
                            status: 'notAttempted',
                        };
                    }
                    return item;
                });
                return newTestInfo;
            });

            setCharacters(charCount);
            setWords(wordCount);
        },
        [timerStarted, selectedParagraph, startTimer]
    );

    return (
        <div className="app">
            {/* Nav Section */}
            <Nav />
            {/* Landing Page */}
            <Landing />
            {/* Challenge Section */}
            <ChallengeSection
                selectedParagraph={selectedParagraph}
                words={words}
                characters={characters}
                wpm={wpm}
                timeRemaining={timeRemaining}
                timerStarted={timerStarted}
                testInfo={testInfo}
                onInputChange={handleUserInput}
                startAgain={startAgain}
            />
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default App;
