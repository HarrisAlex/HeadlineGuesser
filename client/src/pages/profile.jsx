import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Link from '../components/link.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';
import Avatar from '../components/avatar.jsx';

export default class Profile extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            username: "",
            dateJoined: "",
            level: 0,
            streaks: {
                location: 0,
                locationHigh: 0,
                source: 0,
                sourceHigh: 0,
                topic: 0,
                topicHigh: 0
            },
            accuracy: {
                location: 0,
                source: 0,
                topic: 0
            },
            totalPlayed: 0,
            levels: {
                location: 0,
                source: 0,
                topic: 0
            },
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
                        level: data.overallLevel,
                        streaks: {
                            location: data.streaks.location,
                            locationHigh: data.streaks.locationHigh,
                            source: data.streaks.source,
                            sourceHigh: data.streaks.sourceHigh,
                            topic: data.streaks.topic,
                            topicHigh: data.streaks.topicHigh
                        },
                        accuracy: {
                            location: Math.floor(data.accuracy.location * 100) + "%",
                            source: Math.floor(data.accuracy.source * 100) + "%",
                            topic: Math.floor(data.accuracy.topic * 100) + "%"
                        },
                        totalPlayed: data.totalPlayed,
                        levels: {
                            location: data.levels.location,
                            source: data.levels.source,
                            topic: data.levels.topic
                        }
                    });

                    // Parse date joined
                    const date = new Date(data.dateJoined);
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    this.setState({ dateJoined: date.toLocaleDateString(undefined, options) });
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
                        <Avatar colors={{ background: "black", border: "red", foreground: "red" }} foreground="0" width="25svh" height="25svh" />
                        <p>{Strings.DateJoined(language)}: {this.state.dateJoined}</p>
                        <p>{Strings.Level(language)}: {this.state.level}</p>
                    </section>
                    <section style={{
                        paddingLeft: "1rem",
                        paddingRight: "1rem"
                    }}>
                        <section>
                            <h2>{Strings.Statistics(language)}</h2>
                            <div style={{
                                width: "50%",
                                margin: "auto",
                                backgroundColor: Colors.OffsetBackground(),
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "2rem",
                                padding: "1rem",
                            }}>
                                <div>
                                    <h3>{Strings.Streaks(language)}</h3>
                                    <p>{this.state.streaks.location}</p>
                                    <p>{this.state.streaks.source}</p>
                                    <p>{this.state.streaks.topic}</p>
                                </div>
                                <div>
                                    <h3>{Strings.HighestStreaks(language)}</h3>
                                    <p>{this.state.streaks.locationHigh}</p>
                                    <p>{this.state.streaks.sourceHigh}</p>
                                    <p>{this.state.streaks.topicHigh}</p>
                                </div>
                                <div>
                                    <h3>{Strings.Accuracy(language)}</h3>
                                    <p>{this.state.accuracy.location}</p>
                                    <p>{this.state.accuracy.source}</p>
                                    <p>{this.state.accuracy.topic}</p>
                                </div>
                                <div>
                                    <h3>{Strings.TotalPlayed(language)}</h3>
                                    <p>{this.state.totalPlayed}</p>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2>{Strings.Friends(language)} ({this.state.friends.length})</h2>
                            <ul style={{
                                listStyleType: "none",
                                padding: "0.5rem",
                            }}>
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