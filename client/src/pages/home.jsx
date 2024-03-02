import React from 'react';
import TextBox from '../components/textBox.jsx';

export default class Home extends React.Component {
    render() {
        return (
            <div id="gameWindow">
                <div id="questionContainer">
                </div>
                <div id="answerContainer">
                    <TextBox label="Answer" />
                </div>
            </div>
        );
    }
}