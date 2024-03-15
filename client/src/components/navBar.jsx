import React from 'react';

import NavLink from '../components/navLink.jsx';

const pages = [
    {url: "index", name:"Home"},
    {url: "login", name:"Login"},
    {url: "signup", name:"Signup"},
    {url: "leaderboard", name:"Leaderboard"},
]

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePage: window.location.pathname.split("/")[1],
        }
    }

    render() {
        return (
            <nav style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "4rem",
                height: "4rem"
            }}>
                <p style={{fontSize: "1.65rem"}}>Headline Guesser</p>
                {pages.map((page, index) => (
                    <NavLink href={page.url} key={index} destination={page.name} active={this.state.activePage === page.url ? "true" : "false"} />
                ))}
            </nav>
        );
    }
}