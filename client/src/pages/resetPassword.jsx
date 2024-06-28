import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext';

import Strings from '../constants/Strings';

import VerificationCodeModal from '../components/verificationCodeModal';
import Button from '../components/button';

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            newPassword: ""
        }
    }

    onInputChange(event) {
        this.setState({ newPassword: event.target.value });
    }

    handleSubmit() {
        fetch("/api/reset_password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sensitiveToken: sessionStorage.getItem("sensitiveToken"),
                newPassword: this.state.newPassword
            })
        }).then((data) => {
            if (data.status === 200) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location = "/index";
            } else {
                data.json().then((data) => {
                    console.error("Password change failed: " + data.message);
                });
            }

            window.location = "/settings";
        });
    }

    render() {
        return (
            <LanguageContext.Consumer>
            {(language) => (
                <div>
                    <p>Enter your new password:</p>
                    <input type="text" style={{
                        width: "100%",
                        height: "2rem",
                        fontSize: "1rem",
                        textAlign: "center",
                        marginBottom: "1rem",
                    }} onChange={this.onInputChange} />
                    <Button label={Strings.Submit(language)} onClick={this.handleSubmit} />
                    <VerificationCodeModal action="RESET_PASSWORD" />
                </div>
            )}
            </LanguageContext.Consumer>
            
            
        );
    }
}