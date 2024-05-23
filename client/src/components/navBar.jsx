import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Colors from '../constants/Colors.jsx';
import Strings from '../constants/Strings.jsx';

import { ReactComponent as ProfileIcon } from '../images/ui/profile.svg';
import NavLink from '../components/navLink.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleProfileHover = this.handleProfileHover.bind(this);
        this.handleProfileUnhover = this.handleProfileUnhover.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            activePage: window.location.pathname.split("/")[1],
            profileDropdownOpen: false
        }
    }

    handleProfileHover() {
        this.setState({ profileDropdownOpen: true });
    }

    handleProfileUnhover() {
        this.setState({ profileDropdownOpen: false });
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
                            gap: "2rem",
                        }}>
                            <NavLink href={"index"} destination={Strings.Home(language)} active={this.state.activePage === "index" ? "true" : "false"} />
                            <NavLink href={"leaderboard"} destination={Strings.Leaderboard(language)} active={this.state.activePage === "leaderboard" ? "true" : "false"} />
                        </div>
                        <div style={{
                            position: "relative",
                            width: "10rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: Colors.Background(),
                            height: "100%"
                        }} onMouseEnter={this.handleProfileHover} onMouseLeave={this.handleProfileUnhover} >
                            <a href={profileLink} style={{
                                zIndex: 2,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: Colors.Background(),
                            }}>
                                <ProfileIcon style={{
                                    stroke: profileColor,
                                    strokeWidth: "1.5rem",
                                    height: "2.75rem",
                                    transition: Transitions.Hover(),
                                }} />
                            </a>
                            {signedIn ? <div style={{
                                position: "absolute",
                                display: "flex",
                                transform: this.state.profileDropdownOpen ? "translateY(0)" : "translateY(-100%)",
                                transition: Transitions.ProfileDropdown(),
                                flexDirection: "column",
                                background: Colors.OffsetBackground(),
                                top: "4rem",
                                padding: "1rem",
                                gap: "1rem",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                width: "100%",
                            }}>
                                <NavLink href={profileLink} destination={Strings.Profile(language)} />
                                <NavLink href={"settings"} destination={Strings.Settings(language)} />
                                <NavLink onClick={this.handleLogout} destination={Strings.Logout(language)} />
                            </div> : null}
                        </div>
                    </nav>
                )}
            </LanguageContext.Consumer>
        );
    }
}