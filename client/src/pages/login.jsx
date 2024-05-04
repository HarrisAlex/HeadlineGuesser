import React from 'react';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';
import TextBox from '../components/textBox.jsx';
import Button from '../components/button.jsx';
import { LanguageContext } from '../contexts/LanguageContext.js';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: ""
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
                email: this.state.email,
                pass: this.state.password
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                data.json().then((data) => {
                    localStorage.setItem("token", data.token);
                });
            }
            else {
                data.json().then((data) => {
                    this.setState({ error: data.message });
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
                        <form onSubmit={this.handleSubmit} style={{
                            display: "flex",  
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1.5rem",
                            width: "30vw",
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderColor: Colors.Text(),
                            borderRadius: "2rem",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            padding: "2rem"
                        }}>
                            <p style={{
                                fontSize: "1.5rem",
                                transform: "translateY(calc(-1.5rem - 90%))",
                                paddingLeft: "1rem",
                                paddingRight: "1rem",
                                backgroundColor: Colors.Background(),
                                width: "fit-content",
                                alignSelf: "flex-start",
                            }}>{Strings.Login(language)}</p>
                            <TextBox name="email" label={Strings.Email(language)} type="text" autoComplete="email" required onChange={this.handleInputChange} />
                            <TextBox name="password" label={Strings.Password(language)} type="password" autoComplete="current-password" required onChange={this.handleInputChange}/>
                            <Button label={Strings.Login(language)} />
                            <p style={{
                                color: "red"
                            }}>{this.state.error}</p>
                        </form>
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }
}