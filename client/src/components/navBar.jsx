import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';

import NavLink from '../components/navLink.jsx';




export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePage: window.location.pathname.split("/")[1],
        }
    }

    render() {
        return (
            <LanguageContext.Consumer>
                {({ language }) => (
                    <nav style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "4rem",
                        height: "4rem"
                    }}>
                        <p style={{fontSize: "1.65rem"}}>Headline Guesser</p>
                        <NavLink href={"index"} destination={Strings.Home(language)} active={this.state.activePage === "index" ? "true" : "false"} />
                        <NavLink href={"login"} destination={Strings.Login(language)} active={this.state.activePage === "login" ? "true" : "false"} />
                        <NavLink href={"signup"} destination={Strings.Signup(language)} active={this.state.activePage === "signup" ? "true" : "false"} />
                        <NavLink href={"leaderboard"} destination={Strings.Leaderboard(language)} active={this.state.activePage === "leaderboard" ? "true" : "false"} />
                    </nav>
                )}
            </LanguageContext.Consumer>
        );
    }
}