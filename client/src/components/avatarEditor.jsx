import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

import Modal from './modal.jsx';
import Button from './button.jsx';
import Avatar from './avatar.jsx';

export default class AvatarEditor extends React.Component {
    constructor(props) {
        super(props);

        this.changeForeground = this.changeForeground.bind(this);
        this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
        this.changeBorderColor = this.changeBorderColor.bind(this);
        this.changeForegroundColor = this.changeForegroundColor.bind(this);

        this.saveAvatar = this.saveAvatar.bind(this);

        this.state = {
            colors: {
                background: 0,
                border: 0,
                foreground: 0
            },
            foreground: 0,
        }
    }

    componentDidMount() {
        this.setState({ 
            colors: {
                background: this.props.colors.background,
                border: this.props.colors.border,
                foreground: this.props.colors.foreground
            },
            foreground: this.props.foreground
        });
    }

    changeForeground() {
        this.setState({ foreground: (this.state.foreground + 1) % 8 });
    }

    changeBackgroundColor() {
        this.setState({ colors: { 
            background: (this.state.colors.background + 1) % Colors.avatarColorsLength, 
            border: this.state.colors.border,
            foreground: this.state.colors.foreground
        } });
    }

    changeBorderColor() {
        this.setState({ colors: { 
            background: this.state.colors.background,
            border: (this.state.colors.border + 1) % Colors.avatarColorsLength, 
            foreground: this.state.colors.foreground
        } });
    }

    changeForegroundColor() {
        this.setState({ colors: { 
            background: this.state.colors.background,
            border: this.state.colors.border,
            foreground: (this.state.colors.foreground + 1) % Colors.avatarColorsLength 
        } });
    }

    saveAvatar() {
        fetch("/api/set_avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                colors: this.state.colors,
                foreground: this.state.foreground
            })
        }).then((data) => {
            // Check for successful response
            if (data.status === 200) {
                // Avatar saved
                window.location.reload();
            } else if (data.status === 400) {
                data.json().then((data) => {
                    // Check error type
                    if (data.message === "INVALID_TOKEN") {
                        // Invalid token
                        localStorage.removeItem("token");
                        localStorage.removeItem("username");
                        window.location = "/index?error=INVALID_TOKEN";
                    }
                });
            }
        });
    }

    render() {
        if (!this.props.open) {
            return null;
        }

        return (
            <LanguageContext.Consumer>
                {(language) => (
                    <Modal close={this.props.close} header={Strings.AvatarEditor(language)}>
                    <Avatar colors={{ background: this.state.colors.background, border: this.state.colors.border, foreground: this.state.colors.foreground }} foreground={this.state.foreground} width="25svh" height="25svh" />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"                
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}>
                            <Button label="Change Foreground" onClick={this.changeForeground} />
                            <Button label="Change Background Color" onClick={this.changeBackgroundColor} />
                            <Button label="Change Border Color" onClick={this.changeBorderColor} />
                            <Button label="Change Foreground Color" onClick={this.changeForegroundColor} />
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "1rem"
                        }}>
                            <Button label="Save Avatar" onClick={this.saveAvatar} />
                        </div>
                    </div>
                </Modal>)}
            </LanguageContext.Consumer>
        );
    }
}