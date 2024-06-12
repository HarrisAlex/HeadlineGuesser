import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext';

import Strings from '../constants/Strings';

import VerificationCodeModal from '../components/verificationCodeModal';
import Button from '../components/button';

export default class EditUsername extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            username: ""
        }
    }

    onInputChange(event) {
        this.setState({ username: event.target.value });
    }

    handleSubmit() {
        fetch("/api/edit_username", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sensitiveToken: sessionStorage.getItem("sensitiveToken"),
                newUsername: this.state.username
            })
        }).then((data) => {
            if (data.status === 200) {
                localStorage.setItem("username", this.state.username);
            } else {
                data.json().then((data) => {
                    console.error("Username change failed: " + data.message);
                });
            }
        });
    }

    render() {
        return (
            <LanguageContext.Consumer>
            {(language) => (
                <div>
                    <p>Enter your new username:</p>
                    <input type="text" style={{
                        width: "100%",
                        height: "2rem",
                        fontSize: "1rem",
                        textAlign: "center",
                        marginBottom: "1rem",
                    }} onChange={this.onInputChange} />
                    <Button label={Strings.Submit(language)} onClick={this.handleSubmit} />
                    <VerificationCodeModal />
                </div>
            )}
            </LanguageContext.Consumer>
            
            
        );
    }
}