import React, { useContext, useEffect, useState } from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';

import Button from '../components/button.jsx';

export default function Home() {
    const context = useContext(LanguageContext);
    const [previousContext, setPreviousContext] = useState(context);
    const [question, setQuestion] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [mode, setMode] = useState("question");
    const [choiceCorrect, setChoiceCorrect] = useState(false);

    useEffect(() => {
        if (previousContext.language !== context.language)
            setPreviousContext(context);
    }, [previousContext, context]);

    useEffect(() => {
        if (mode === "question") {            
            fetch("/api/question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ language: context.languageIndex })
            }).then((data) => {
                // Check for successful response
                if (data.status === 200) {
                    // Switch to question mode
                    data.json().then((dataJson) => {
                        // Set current question
                        setQuestion(dataJson.questionString);
                        setQuestionIndex(dataJson.question);
                        setChoices(dataJson.choices);
                    });
                }
            });
        }   
    }, [mode, context]);
    
    if (mode === "question") {
        return (
            <LanguageContext.Consumer>
                {({ language, languageIndex }) => (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "2rem",
                        height: "calc(100svh - 6rem)"
                    }}>
                        <p style={{
                            fontSize: "2rem"
                        }}>{question}
                        </p>
                        <div style={{
                            display: "flex",
                            gap: "1rem"
                        }}>
                            {choices.map((choice, index) =>  (
                                <Button key={index} label={choice} onClick={() => {
                                    checkAnswer(languageIndex, questionIndex, index, (correct) => {
                                        setMode("answer");
                                        setChoiceCorrect(correct);
                                    });
                                }} />
                            ))}
                        </div>
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    } else {
        return (
            <LanguageContext.Consumer>
                {({ language }) => (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "2rem",
                        height: "calc(100svh - 6rem)"
                    }}>
                        <p style={{
                            fontSize: "2rem"
                        }}>{choiceCorrect ? Strings.Correct(language) : Strings.Incorrect(language)}
                        </p>
                        <Button label={Strings.NextQuestion(language)} onClick={() => {
                            setMode("question");
                        }} />
                    </div>
                )}
                </LanguageContext.Consumer>
        );
    }
}

function checkAnswer(language, questionIndex, choice, callback) {
    fetch("/api/answer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            language: language,
            question: questionIndex,
            answer: choice
        })
    })
    .then((data) => {
        // Check for successful response
        if (data.status === 200) {
            data.json().then((dataJson) => {
                callback(dataJson.correct);
            });
        }
    });
}