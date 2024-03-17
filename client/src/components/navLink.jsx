import React from 'react';

import Colors from '../constants/Colors.jsx';

export default class NavLink extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isHovered: false,
            active: false
        };
    }

    handleHover = () => {
        this.setState({ isHovered: true });
    }

    handleUnhover = () => {
        this.setState({ isHovered: false });
    }

    render() {
        let color;

        if (this.props.active === "true")
            color = Colors.Accent(2);
        else
            color = this.state.isHovered ? Colors.Accent(1) : Colors.Text();

        return (
            <a
                onMouseEnter={this.handleHover}
                onMouseLeave={this.handleUnhover}
                style={{
                    background: "none",
                    color: color,
                    borderColor: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                    fontSize: "1.15rem",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                }}
                {...this.props}>
                {this.props.destination}
            </a>
        );
    }
}