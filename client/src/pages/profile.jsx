import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Link from '../components/link.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

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
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");

        // Retrieve user from backend
        fetch("/api/get_user?user=" + user, {
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
                    });
                });
            }
        });

        // Retrieve friends from backend
        fetch("/api/get_friends?user=" + user, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }, 
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    // Set friends list
                    this.setState({ friends: data.friends });
                });
            }
        });
    }

    render () {
        // Create friends list from array
        let friendsList = this.state.friends.map((element, index) => {
            return (
                <li key={index}>
                    <Link href={"/profile?user=" + element} text={element} />
                </li>
            );
        });

        return (
            <LanguageContext.Consumer>
            {({ language }) => (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "40svw 60svw",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    minHeight: "calc(100svh - 6rem)",
                }}>
                    <section style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                    }}>
                        <h1>{this.state.username}</h1>
                        <div style={{
                            width: "25svh",
                            height: "25svh",
                            borderRadius: "50%",
                            backgroundColor: Colors.OffsetBackground(),
                            margin: "auto",
                        }}></div>
                        <p>{Strings.DateJoined(language)}: {this.state.dateJoined}</p>
                        <p>{Strings.Score(language)}: {this.state.points}</p>
                    </section>
                    <section style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem"
                    }}>
                        <section>
                            <h2>{Strings.Rank(language)}</h2>
                            <div style={{
                                width: "100%",
                                height: "5rem",
                                backgroundColor: Colors.OffsetBackground(),
                            }}></div>
                        </section>
                        <section>
                            <h2>{Strings.Friends(language)} ({this.state.friends.length})</h2>
                            <ul>
                                {friendsList}
                            </ul>
                        </section>
                    </section>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}