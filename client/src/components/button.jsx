import React from 'react';

import { ReactComponent as Close } from '../images/ui/close.svg';

import Colors from '../constants/Colors.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isHovered: false,
        };
    }

    handleHover = () => {
        this.setState({ isHovered: true });
    }

    handleUnhover = () => {
        this.setState({ isHovered: false });
    }

    render() {
        let style = {
            background: "none",
            color: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
            borderColor: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
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
                    stroke: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                }}/>
                break;
        }

        return (
            <button 
                type="submit" 
                style={style}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                {...this.props}>{text}</button>
        );
    }
}