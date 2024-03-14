import React from 'react';
import TextBox from '../components/textBox.jsx';
import Button from '../components/button.jsx';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);

        this.state = {
            question: ""
        }
    }
    
    componentDidMount() {
        window.addEventListener("load", this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener("load", this.handleLoad);
    }

    handleLoad() {        
        fetch("/api/question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((data) => {
            if (data.status === 200) {
                data.json().then((dataJson) => {
                    this.setState({ question: dataJson.question });
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
    
    render() {
        return (
            <div id="gameWindow">
                <div id="questionContainer">
                </div>
                <div id="answerContainer">
                    <TextBox label="Answer" />
                </div>
                <Button label="Submit" onClick={() => {
                    fetch("/api/answer", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            question: this.state.question,
                            answer: "paris"
                        })
                    }).then((data) => {
                        if (data.status === 200) {
                            data.json().then((dataJson) => {
                                console.log(dataJson);
                            });
                        }
                    });
                }}/>
            </div>
        );
    }
}