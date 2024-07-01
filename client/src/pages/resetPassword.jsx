import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext';

import Strings from '../constants/Strings';
import API from '../constants/API.jsx';

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
        // Send reset password request to backend
        API.post("/api/reset_password", {
            sensitiveToken: sessionStorage.getItem("sensitiveToken"),
            newPassword: this.state.newPassword
        }, () => {
            // Log out user if password reset is successful
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location = "/index";
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