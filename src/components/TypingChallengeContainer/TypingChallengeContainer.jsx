import React from 'react';
import ChallengeDetailsCard from '../ChallengeDetailsCard/ChallengeDetailsCard';
import TypingChallenge from '../TypingChallenge/TypingChallenge';
import './TypingChallengeContainer.css';

const TypingChallengeContainer = ({
    selectedParagraph,
    timerStarted,
    timeRemaining,
    words,
    characters,
    wpm,
    testInfo,
    onInputChange
}) => {
    return (
        <div className="typing-chhallenge-container">
            {/* Details Section */}
            <div className="details-container">
                {/* words Typed */}
                <ChallengeDetailsCard cardName="Words" cardValue={words} />

                {/* Characters Typed */}
                <ChallengeDetailsCard cardName="Characters" cardValue={characters} />

                {/* Speed */}
                <ChallengeDetailsCard cardName="Speed" cardValue={wpm} />
            </div>

            {/* The real Challenge*/}
            <div className="typewriter-container">
                <TypingChallenge
                    onInputChange={onInputChange}
                    selectedParagraph={selectedParagraph}
                    timerStarted={timerStarted}
                    timeRemaining={timeRemaining}
                    testInfo={testInfo}
                />
            </div>
        </div>
    )
}


export default TypingChallengeContainer;