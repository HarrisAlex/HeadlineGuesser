import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';
import Leaderboard from './leaderboard';

export default class Profile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: "",
            dateJoined: "",
            score: "",
            friends: [],
        }
    }

    componentDidMount() {
        // Retrieve user information on load
        this.retrieveUserInfo();
    }

    retrieveUserInfo() {
        // Retrieve user from backend
        fetch("/api/get_user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    // Set user information
                    this.setState({ 
                        username: data.username,
                        dateJoined: data.dateJoined,
                        score: data.score,
                        friends: data.friends
                    });
                });
            }
        });
    }

    render () {
        // Create friends list from array
        let friendsList = this.state.friends.map((element, index) => {
            return (
                <li key={index}>{element.username}</li>
            );
        });

        return (
            <LanguageContext.Consumer>
            {({ language }) => (
                <div>
                    <h1>Profile</h1>
                    <p>{Strings.Username(language)}: {this.state.username}</p>
                    <p>{Strings.DateJoined(language)}: {this.state.dateJoined}</p>
                    <p>{Strings.Score(language)}: {this.state.points}</p>
                    <h2>{Strings.Friends(language)}</h2>
                    <ul>
                        {friendsList}
                    </ul>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}