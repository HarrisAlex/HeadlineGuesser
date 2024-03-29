import React from 'react';

import Strings from '../constants/Strings.jsx';
import TextBox from '../components/textBox.jsx';
import Button from '../components/button.jsx';
import { LanguageContext } from '../contexts/LanguageContext.js';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        // Get input name and value from element
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();
        
        // Send login request to backend
        fetch("/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            // Send username and password to backend
            body: JSON.stringify({
                username: this.state.username,
                pass: this.state.password
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    console.log(data);
                });
            }
            else {
                data.json().then((data) => {
                    console.log(data.error);
                });
            }
        });
    }

    render() {
        return (
            <LanguageContext.Consumer>
                {({ language }) => (
                    <div style={{
                        textAlign: "center"
                    }}>
                        <h1>Welcome to the Login Page</h1>
                        <form onSubmit={this.handleSubmit} style={{
                            display: "flex",  
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1.5rem",
                        }}>
                            <TextBox name="username" label={Strings.Username(language)} type="text" required onChange={this.handleInputChange} />
                            <TextBox name="password" label={Strings.Password(language)} type="password" required onChange={this.handleInputChange}/>
                            <Button label={Strings.Login(language)} />
                        </form>
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }
}