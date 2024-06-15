import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from '../components/button.jsx';

import Strings from '../constants/Strings.jsx';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.handleEditUsername = this.handleEditUsername.bind(this);
    }

    handleEditUsername() {
        fetch("/api/request_verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                action: "edit_username",
                language: localStorage.getItem("language")
            }),
        }).then((data) => {
            if (data.status === 200) {
                window.location = "/edit_username";
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
                    <Button label={Strings.EditUsername(language)} onClick={this.handleEditUsername}/>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}