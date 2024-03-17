import React from 'react';
import Button from '../components/button.jsx';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);

        this.state = {
            question: "",
            choices: []
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
            }
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((dataJson) => {
                    // Set current question
                    this.setState({ question: dataJson.question });
                    this.setState({ choices: dataJson.choices });
                    console.log(dataJson.question);

                    if (dataJson.choices) {
                        dataJson.choices.map((choice) => (
                            console.log("Choice: " + choice)
                        ));
                    }
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
                question: this.state.question,
                answer: choice
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((dataJson) => {
                    console.log(dataJson.correct);
                });
            }
        });
    }
    
    render() {
        return (
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
        );
    }
}