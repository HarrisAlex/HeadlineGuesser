import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';

import Button from '../components/button.jsx';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        this.retrieveLeaderboard = this.retrieveLeaderboard.bind(this);
    }

    retrieveLeaderboard() {
        // Retrieve leaderboard from backend
        fetch("/api/leaderboard", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
         }).then((data) => {
            // Check for successful response
             if (data.status === 200) {
                data.json().then((data) => {
                    console.log(data.leaderboard);
                });
             }
         });
    }
    render() {
        return (
            <LanguageContext.Consumer>
            {({ language }) => (
                <div>
                    <h1>Welcome to the Leaderboard Page</h1>
                    <Button label={Strings.Leaderboard(language)} onClick={this.retrieveLeaderboard}/>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}