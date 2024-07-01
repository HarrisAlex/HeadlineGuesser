import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';
import API from '../constants/API.jsx';

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
        const urlParams = new URLSearchParams(window.location.search);
        const leaderboard = urlParams.get("leaderboard");

        // Retrieve leaderboard from backend
        API.get("/api/leaderboard?leaderboard=" + leaderboard, (data) => {
            this.setState({ leaderboard: data.leaderboard });
        });
    }

    render() {
        if (this.state.leaderboard.length === 0) {
            return null;
        }

        let leaderboard = this.state.leaderboard.map((element, index) => {
            return (
                <tr style={{
                    backgroundColor: index % 2 === 1 ? Colors.OffsetBackground() : Colors.Background()
                }} key={index}>
                    <td>{index + 1}</td>
                    {Object.entries(element).map((subelement, subindex) => {
                            if (subelement[0] === "USERNAME") {
                                return <td key={subindex}><a href={"/profile?user=" + subelement[1]}>{subelement[1]}</a></td>;
                            }

                            return <td key={subindex}>{subelement[1]}</td>;
                        })}
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
                        borderCollapse: "collapse",
                    }}>
                        <thead style={{
                            backgroundColor: Colors.OffsetBackground()
                        }}>
                            <tr>
                                <th style={{
                                    padding: "1rem"
                                }}>{Strings.Rank(language)}</th>
                                {Object.entries(this.state.leaderboard[0]).map((subelement, subindex) => {
                                    return <th style={{
                                        padding: "1rem"
                                    }}key={subindex}>{Strings.LeaderboardHeader(subelement[0], language)}</th>;
                                })}
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