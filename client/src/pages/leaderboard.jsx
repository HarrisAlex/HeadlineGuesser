import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

export default class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leaderboard: []
        }

        this.retrieveLeaderboard = this.retrieveLeaderboard.bind(this);
    }

    componentDidMount() {
        this.retrieveLeaderboard();
    }

    retrieveLeaderboard() {
        // Retrieve leaderboard from backend
        fetch("/api/leaderboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
         }).then((data) => {
            // Check for successful response
             if (data.status === 200) {
                data.json().then((data) => {
                    this.setState({ leaderboard: data.leaderboard });
                });
             }
         });
    }

    render() {        
        let leaderboard = this.state.leaderboard.map((element, index) => {
            return (
                <tr style={{
                    backgroundColor: index % 2 === 1 ? Colors.OffsetBackground() : Colors.Background()
                }} key={index}>
                    <td>{index + 1}</td>
                    <td><a href={"/profile?user=" + element.USERNAME}>{element.USERNAME}</a></td>
                    <td>{element.SCORE}</td>
                </tr>
            );
        });

        return (
            <LanguageContext.Consumer>
            {({ language }) => (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "2rem",
                    height: "calc(100svh - 6rem)"
                }}>
                    <h1>{Strings.Leaderboard(language)}</h1>
                    <table style={{
                        width: "50%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                        borderCollapse: "collapse"
                    }}>
                        <thead style={{
                            backgroundColor: Colors.OffsetBackground()
                        }}>
                            <tr>
                                <th style={{width: "33%"}}>{Strings.Rank(language)}</th>
                                <th style={{width: "33%"}}>{Strings.Username(language)}</th>
                                <th style={{width: "33%"}}>{Strings.Level(language)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard}
                        </tbody>
                    </table>
                </div>
            )}
            </LanguageContext.Consumer>
        );
    }
}