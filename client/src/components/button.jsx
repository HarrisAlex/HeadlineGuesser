import React from 'react';

import Colors from '../constants/Colors.jsx';

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
                    transition: "all 0.25s ease",
                    cursor: "pointer"
                }}
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                {...this.props}>{this.props.label}</button>
        );
    }
}