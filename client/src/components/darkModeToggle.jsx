import React from 'react';

import Colors from '../constants/Colors.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class DarkModeToggle extends React.Component {
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
                    fill: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                    transform: localStorage.getItem("darkMode") === "true" ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformOrigin: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    border: "none",
                    transition: Transitions.Hover(),
                    cursor: "pointer",
                    position: "absolute",
                    right: "1rem",
                    bottom: "1rem",
                    zIndex: "100"
                }}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                {...this.props}>
                    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{
                        width: "100%",
                        height: "100%"
                    }}>
                        <path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z"/>
                        <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z"/>
                    </svg>
                </button>
        );
    }
}