import React from 'react';

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
        return (
            <button 
                type="submit" 
                style={{
                    background: "none",
                    color: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                    borderColor: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    transition: Transitions.Hover(),
                    cursor: "pointer"
                }}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                {...this.props}>{this.props.label}</button>
        );
    }
}