import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Link from '../components/link.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';
import Avatar from '../components/avatar.jsx';
import AvatarEditor from '../components/avatarEditor.jsx';
import Button from '../components/button.jsx';

export default class Profile extends React.Component {
    constructor (props) {
        super(props);

        this.openAvatarEditor = this.openAvatarEditor.bind(this);
        this.addFriend = this.addFriend.bind(this);

        this.state = {
            username: "user",
            dateJoined: "August 8, 2003",
            level: 1,
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
            avatarEditorOpen: false,
            avatar: {
                colors: {
                    background: 10,
                    border: 10,
                    foreground: 10
                },
                foreground: 0
            },
            friendStatus: false,
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
                            location: Math.floor(data.accuracy.location * 100),
                            source: Math.floor(data.accuracy.source * 100),
                            topic: Math.floor(data.accuracy.topic * 100)
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

        // Retrieve avatar from backend
        fetch("/api/get_avatar?user=" + user, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    // Set avatar
                    this.setState({ avatar: {
                        colors: {
                            background: data.colors.background,
                            border: data.colors.border,
                            foreground: data.colors.foreground
                        },
                        foreground: data.foreground
                    } });
                });
            }
        });

        if (localStorage.getItem("username") === user 
            || localStorage.getItem("username") === null 
            || localStorage.getItem("token") === null) {
            return;
        }

        // Get friend status
        fetch("/api/get_friend_status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                username: user
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    // Set friend status
                    this.setState({ friendStatus: data.message });
                });
            }
        });
    }

    openAvatarEditor() {
        this.setState({ avatarEditorOpen: true });
    }

    addFriend() {
        const user = new URLSearchParams(window.location.search).get("user");
        fetch("/api/add_friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                username: user
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                window.location.reload();
            } else if (data.status === 400) {
                data.json().then((data) => {
                    if (data.message === "INVALID_TOKEN") {
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        window.location = "/login?error=INVALID_TOKEN";
                    }
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

        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");

        const avatarEditor = this.state.avatarEditorOpen ? <AvatarEditor colors={ this.state.avatar.colors } foreground={ this.state.avatar.foreground } open={this.state.avatarEditorOpen} close={() => this.setState({ avatarEditorOpen: false })}/> : null;        

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
                        <Avatar colors={{ 
                            background: this.state.avatar.colors.background, 
                            border: this.state.avatar.colors.border, 
                            foreground: this.state.avatar.colors.foreground }} foreground={this.state.avatar.foreground} width="25svh" height="25svh" />
                        {localStorage.getItem("username") === user ? <Button label={Strings.EditAvatar(language)} onClick={this.openAvatarEditor} /> : null}
                        {localStorage.getItem("username") !== user && this.state.friendStatus === "FRIEND_REQUEST_NOT_SENT" ? <Button label={Strings.AddFriend(language)} onClick={this.addFriend} /> : null}
                        {localStorage.getItem("username") !== user && this.state.friendStatus !== "FRIEND_REQUEST_NOT_SENT" ? <p>{Strings.FriendStatus(this.state.friendStatus, language)}</p> : null}
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
                                    <p>{this.state.accuracy.location}%</p>
                                    <p>{this.state.accuracy.source}%</p>
                                    <p>{this.state.accuracy.topic}%</p>
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
                    {avatarEditor}
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}