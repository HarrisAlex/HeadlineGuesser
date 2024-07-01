import React from 'react';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';
import TextBox from '../components/textBox.jsx';
import Button from '../components/button.jsx';
import { LanguageContext } from '../contexts/LanguageContext.js';
import API from '../constants/API.jsx';

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

    componentDidMount() {
        const urlErrorParam = new URLSearchParams(window.location.search).get("error");

        this.setState({ error: urlErrorParam });
    }

    handleInputChange(event) {
        // Get input name and value from element
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({ [name]: value });
        this.setState({ error: "" });
    }

    handleSubmit(event) {
        event.preventDefault();

        // Send login request to backend
        API.post("/api/login", { email: this.state.email, pass: this.state.password }, (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            window.location = "/index";
        }, (data) => {
            this.setState({ error: data.status });
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
                            <p style={{
                                color: "red",
                            }}>{Strings.LoginError(this.state.error, language)}</p>
                            <Button label={Strings.Login(language)} />
                        </form>
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }
}