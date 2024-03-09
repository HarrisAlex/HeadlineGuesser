import React from 'react';

import Button from '../components/button.jsx';

export default class Leaderboard extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome to the Leaderboard Page</h1>
                <Button label="Leaderboard" onClick={() => {
                    fetch("/api/leaderboard", {
                       method: "GET",
                       headers: {
                           "Content-Type": "application/json"
                       },
                    }).then((data) => {
                        if (data.status === 200)
                        {
                            data.json().then((data) => {
                               console.log(data.leaderboard);
                            });
                        }
                    });
                }}/>
            </div>
        );
    }
}