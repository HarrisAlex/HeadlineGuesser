import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';

import Button from '../components/button.jsx';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);

        this.state = {
            question: "",
            choices: [],
            mode: "question",
            choiceCorrect: false
        }
    }
    
    componentDidMount() {
        window.addEventListener("load", this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener("load", this.handleLoad);
    }

    handleLoad() {
        // Call question API from backend
        fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ language: "english" })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                // Switch to question mode
                this.setState({ mode: "question" });

                data.json().then((dataJson) => {
                    // Set current question
                    this.setState({ question: dataJson.question });
                    this.setState({ choices: dataJson.choices });
                });
            }
        });
    }

    handleAnswerSubmit(choice) {
        // Retrieve answer from backend
        fetch("/api/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: "english",
                question: this.state.question,
                answer: choice
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                // Switch to answer mode
                this.setState({ mode: "answer" });

                data.json().then((dataJson) => {
                    this.setState({ choiceCorrect: dataJson.correct });
                });
            }
        });
    }
    
    render() {
        if (this.state.mode === "question") {
            return (
                <LanguageContext.Consumer>
                    {({ language }) => (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "2rem",
                            height: "calc(100svh - 4rem)"
                        }}>
                            <p style={{
                                fontSize: "2rem"
                            }}>{this.state.question}
                            </p>
                            <div style={{
                                display: "flex",
                                gap: "1rem"
                            }}>
                                {this.state.choices.map((choice, index) =>  (
                                    <Button key={index} label={choice} onClick={() => this.handleAnswerSubmit(choice)} />
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
                            height: "calc(100svh - 4rem)"
                        }}>
                            <p style={{
                                fontSize: "2rem"
                            }}>{this.state.choiceCorrect ? Strings.Correct(language) : Strings.Incorrect(language)}
                            </p>
                            <Button label={Strings.NextQuestion(language)} onClick={this.handleLoad} />
                        </div>
                    )}
                    </LanguageContext.Consumer>
            );
        }
    }
}