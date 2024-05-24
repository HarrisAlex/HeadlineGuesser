import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Colors from '../constants/Colors.jsx';
import Strings from '../constants/Strings.jsx';

import { ReactComponent as ProfileIcon } from '../images/ui/profile.svg';
import NavLink from '../components/navLink.jsx';
import Transitions from '../constants/Transitions.jsx';
import DropdownMenu from './dropdownMenu.jsx';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleProfileHover = this.handleProfileHover.bind(this);
        this.handleProfileUnhover = this.handleProfileUnhover.bind(this);
        this.handleLeaderboardHover = this.handleLeaderboardHover.bind(this);
        this.handleLeaderboardUnhover = this.handleLeaderboardUnhover.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            activePage: window.location.pathname.split("/")[1],
            profileDropdownOpen: false,
            leaderboardDropdownOpen: false
        }
    }

    handleProfileHover() {
        this.setState({ profileDropdownOpen: true });
    }

    handleProfileUnhover() {
        this.setState({ profileDropdownOpen: false });
    }

    handleLeaderboardHover() {
        this.setState({ leaderboardDropdownOpen: true});
    }

    handleLeaderboardUnhover() {
        this.setState({ leaderboardDropdownOpen: false});
    }

    handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location = "/index";
    }

    render() {
        let profileColor = this.state.profileDropdownOpen ? Colors.Accent(1) : Colors.Text();
        if (this.state.profileFocused) {
            profileColor = Colors.Accent(2);
        }

        // const dropdownElementStyle = { 
        //     width: "100%",
        //     paddingTop: "0.25rem",
        //     paddingBottom: "calc(0.25rem + 2px)",
        // }

        // const dropdownElementMiddleStyle = {
        //     ...dropdownElementStyle,
        //     borderBottomStyle: "solid",
        //     borderBottomColor: Colors.GlassPanelBorder(), 
        //     borderBottomWidth: "1px", 
        //     paddingBottom: "0.25rem"
        // }

        const profileLink = localStorage.getItem("username") !== null ? "profile?user=" + localStorage.getItem("username") : "login";
        const signedIn = localStorage.getItem("token") !== null;

        return (
            <LanguageContext.Consumer>
                {({ language }) => (
                    <nav style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "4rem",
                        marginBottom: "2rem",
                        paddingLeft: "2rem",
                        paddingRight: "2rem"
                    }}>
                        <p style={{fontSize: "1.65rem"}}>Headline Guesser</p>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "2rem",
                            height: "100%"
                        }}>
                            <NavLink href={"index"} destination={Strings.Home(language)} active={this.state.activePage === "index" ? "true" : "false"} />
                            <DropdownMenu icon={<p style={{
                                fontSize: "1.15rem",
                                transition: Transitions.Hover(),
                                cursor: "pointer",
                            }}>{Strings.Leaderboard()}</p>} onHover={this.handleLeaderboardHover} onUnhover={this.handleLeaderboardUnhover}>
                                <NavLink href={"leaderboard?leaderboard=level_leaderboard"} destination={Strings.Leaderboard(language)} />
                                <NavLink href={"leaderboard?leaderboard=streaks_leaderboard"} destination={Strings.Leaderboard(language)} />
                            </DropdownMenu>
                        </div>
                        <DropdownMenu icon={<ProfileIcon style={{
                            stroke: profileColor,
                            strokeWidth: "1.5rem",
                            height: "2.75rem",
                            transition: Transitions.Hover(),
                        }} />} href={profileLink} onHover={this.handleProfileHover} onUnhover={this.handleProfileUnhover} >
                            <NavLink href={profileLink} destination={Strings.Profile(language)} />
                            <NavLink href={"settings"} destination={Strings.Settings(language)} />
                            <NavLink onClick={this.handleLogout} destination={Strings.Logout(language)} />
                        </DropdownMenu>
                    </nav>
                )}
            </LanguageContext.Consumer>
        );
    }
}