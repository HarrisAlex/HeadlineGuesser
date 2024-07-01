import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext';

import Strings from '../constants/Strings';

import VerificationCodeModal from '../components/verificationCodeModal';
import Button from '../components/button';
import API from '../constants/API.jsx';

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
        // Edit username in the database
        API.post("/api/edit_username", { sensitiveToken: sessionStorage.getItem("sensitiveToken"), newUsername: this.state.username }, () => {
            // Change the username in the local storage
            localStorage.setItem("username", this.state.username);

            // Redirect to the settings page
            window.location = "/settings";
        }, () => { window.location = "/settings"; });
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
                    <VerificationCodeModal action="EDIT_USERNAME" />
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}