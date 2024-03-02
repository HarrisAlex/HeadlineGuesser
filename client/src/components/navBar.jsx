import React from 'react';

const pages = [
    {url: "", name:"Home"},
    {url: "login", name:"Login"},
    {url: "signup", name:"Signup"},
    {url: "leaderboard", name:"Leaderboard"},
]

export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activePage: "home",
        }
    }

    render() {
        return (
            <nav>
                <p>Headline Guesser</p>
                {pages.map((page) => (
                    <a href={"/" + page.url} key={page.name} className={'/' + page.url === window.location.pathname ? 'nav-link active' : 'nav-link'}>{page.name}</a>
                ))}
            </nav>
        );
    }
}