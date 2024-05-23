import React from 'react';

import { ReactComponent as Close } from '../images/ui/close.svg';

import Colors from '../constants/Colors.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class Button extends React.Component {
    constructor(props) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleUnhover = this.handleUnhover.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            isHovered: false,
            clicked: false
        };
    }

    handleHover() {
        this.setState({ isHovered: true });
    }

    handleUnhover() {
        this.setState({ isHovered: false });
    }

    handleFocus() {
        this.setState({ clicked: true });

        setTimeout(this.handleBlur, 200);
    }

    handleBlur() {
        this.setState({ clicked: false });
    }

    render() {
        let color = this.state.isHovered ? Colors.Accent(1) : Colors.Text();
        if (this.state.clicked) {
            color = Colors.Accent(2);
        }

        let style = {
            background: localStorage.getItem("darkMode") === "true" ? "none" : Colors.ButtonBackground(),
            color: color,
            borderColor: color,
            borderWidth: "1px",
            borderStyle: "solid",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            transition: Transitions.Hover(),
            cursor: "pointer",
        };

        let text = this.props.label;

        switch (this.props.type) {
            case "close":
                style = {
                    ...style,
                    background: "none",
                    borderStyle: "none",
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    width: "2rem",
                    height: "2rem",
                    lineHeight: "0.5rem",
                    padding: "0"
                };

                text = <Close style={{
                    width: "100%",
                    height: "100%",
                    stroke: color,
                    transition: Transitions.Hover(),
                }}/>
                break;
            default:
                break;
        }

        return (
            <button 
                type="submit" 
                style={style}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onClick={() => {
                    this.props.onClick();
                }}
                {...this.props}>{text}</button>
        );
    }
}