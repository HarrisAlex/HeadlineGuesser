import React from 'react';

import Colors from '../constants/Colors.jsx';

import Button from './button.jsx';
import Avatar from './avatar.jsx';

export default class AvatarEditor extends React.Component {
    constructor(props) {
        super(props);

        this.changeForeground = this.changeForeground.bind(this);
        this.changeBackgroundColor = this.changeBackgroundColor.bind(this);
        this.changeBorderColor = this.changeBorderColor.bind(this);
        this.changeForegroundColor = this.changeForegroundColor.bind(this);

        this.state = {
            colors: {
                background: "black",
                border: "red",
                foreground: "red"
            },
            foreground: 0
        }
    }

    changeForeground() {
        this.setState({ foreground: (this.state.foreground + 1) % 8 });
    }

    changeBackgroundColor() {
        this.setState({ colors: { background: Colors.Random(), border: this.state.colors.border, foreground: this.state.colors.foreground } });
    }

    changeBorderColor() {
        this.setState({ colors: { background: this.state.colors.background, border: Colors.Random(), foreground: this.state.colors.foreground } });
    }

    changeForegroundColor() {
        this.setState({ colors: { background: this.state.colors.background, border: this.state.colors.border, foreground: Colors.Random() } });
    }

    render() {
        return (
            <div style={{
                width: "60svw",
                height: "60svh",
                position: "absolute",
                top: "20svh",
                left: "20svw",
                backgroundColor: Colors.GlassPanel(),
                backdropFilter: "blur(10px)",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
            }}>
                <Avatar colors={{ background: this.state.colors.background, border: this.state.colors.border, foreground: this.state.colors.foreground }} foreground={this.state.foreground} width="25svh" height="25svh" />
                <div style={{
                    display: "flex",
                    flexDirection: "column",                    
                }}>
                    <Button label="Change Foreground" onClick={this.changeForeground} />
                    <Button label="Change Background" onClick={this.changeBackgroundColor} />
                    <Button label="Change Border" onClick={this.changeBorderColor} />
                    <Button label="Change Foreground Color" onClick={this.changeForegroundColor} />
                </div>
            </div>
        );
    }
}