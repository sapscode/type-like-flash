import React from 'react';
import './TestLetter.css';

const TestLetter = ({ individualLetterInfo }) => {
    const { status } = individualLetterInfo // es6 destructuring
    // const status = individualLetterInfo.status; // instead of this we can write like upper statement


    const statusClass = {
        correct: "test-letter-correct",
        incorrect: "test-letter-incorrect",
        notAttempted: "test-letter-not-attempted"
    }[status]

    //let statusClass;
    // if (status === "correct") {
    //     statusClass = "test-letter-correct"
    // } else if (status === "incorrect") {
    //     statusClass = "test-letter-incorrect"
    // } else {
    //     statusClass = "test-letter-not-attempted"
    // }

    return (
        <span className={`test-letter ${statusClass}`}>
            {individualLetterInfo.testLetter}
        </span>
    );
}

export default TestLetter;