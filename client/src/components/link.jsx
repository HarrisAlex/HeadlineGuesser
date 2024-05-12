import React from 'react';

import Colors from '../constants/Colors.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class Link extends React.Component {
    constructor(props) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleUnhover = this.handleUnhover.bind(this);

        this.state = {
            isHovered: false,
        };
    }

    handleHover() {
        this.setState({ isHovered: true });
    }

    handleUnhover() {
        this.setState({ isHovered: false });   
    }

    render() {
        return (
            <a href={this.props.href} onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover} style={{
                color: this.state.isHovered ? Colors.Accent(1) : Colors.Text(),
                textDecoration: "none",
                transition: Transitions.Hover()    
            }} {...this.props}>{this.props.text}</a>
        );
    }
}