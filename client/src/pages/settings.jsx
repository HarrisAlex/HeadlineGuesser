import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from '../components/button.jsx';

import Strings from '../constants/Strings.jsx';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.requestVerification = this.requestVerification.bind(this);
    }

    handleEditUsername() {
        fetch("/api/request_verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                action: "EDIT_USERNAME",
                language: localStorage.getItem("language")
            }),
        }).then((data) => {
            if (data.status === 200) {
                window.location = "/edit_username";
            } else {
                alert("An error occurred. Please try again later.");
            }
        });
    }

    requestVerification(action) {
        fetch("/api/request_verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                action: action.toUpperCase(),
                language: localStorage.getItem("language")
            })
        }).then((data) => {
            if (data.status === 200) {
                window.location = "/" + action;
            } else {
                alert("An error occurred. Please try again.");
            }
        });
    }

    render() {
        return (
            <LanguageContext.Consumer>
            {({ language }) => (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <h1>{Strings.Settings(language)}</h1>
                    <Button label={Strings.EditUsername(language)} onClick={() => this.requestVerification("edit_username")}/>
                    <Button label={Strings.ResetPassword(language)} onClick={() => this.requestVerification("reset_password")}/>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}