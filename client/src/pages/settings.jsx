import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from '../components/button.jsx';

import Strings from '../constants/Strings.jsx';
import API from '../constants/API.jsx';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.requestVerification = this.requestVerification.bind(this);
    }

    requestVerification(action) {
        // Send request verification request to backend
        API.post("/api/request_verification", {
            token: localStorage.getItem("token"),
            action: action.toUpperCase(),
            language: localStorage.getItem("language")
        }, (data) => { window.location = "/" + action; }, () => { alert(Strings.GenericError(localStorage.getItem("language"))); });
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