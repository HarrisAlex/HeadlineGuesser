import React from 'react';

import Colors from '../constants/Colors.jsx';
import Transitions from '../constants/Transitions.jsx';

export default class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleHover = this.handleHover.bind(this);
        this.handleUnhover = this.handleUnhover.bind(this);

        this.state = {
            dropdownOpen: false
        }
    }

    handleHover() {
        this.setState({ dropdownOpen: true });
        this.props.onHover();
    }

    handleUnhover() {
        this.setState({ dropdownOpen: false });
        this.props.onUnhover();
    }

    render() {
        const dropdownElementStyle = { 
            width: "100%",
            paddingTop: "0.25rem",
            paddingBottom: "calc(0.25rem + 2px)",
        }

        const dropdownElementMiddleStyle = {
            ...dropdownElementStyle,
            borderBottomStyle: "solid",
            borderBottomColor: Colors.GlassPanelBorder(), 
            borderBottomWidth: "1px", 
            paddingBottom: "0.25rem"
        }
        return (
            <div style={{
                position: "relative",
                width: "10rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: Colors.Background(),
                height: "100%"
            }} onMouseEnter={this.handleHover} onMouseLeave={this.handleUnhover} >
                <a href={this.props.href} style={{
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.Background(),
                }}>
                    {this.props.icon}
                </a>
                {<div style={{
                    position: "absolute",
                    display: "flex",
                    transform: this.state.dropdownOpen ? "translateY(0)" : "translateY(-100%)",
                    transition: Transitions.ProfileDropdown(),
                    flexDirection: "column",
                    background: Colors.GlassPanel(),
                    top: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    width: "100%",
                }}>
                    {this.props.children.length > 1 ? this.props.children.map((child, index) => {
                        if (index < this.props.children.length - 1) 
                            return <span key={index} style={dropdownElementMiddleStyle}>{child}</span>
                        else
                            return <span key={index} style={dropdownElementStyle}>{child}</span>
                    }) : <span style={dropdownElementStyle}>{this.props.children}</span>}
                </div>}
            </div>
        );
    }
}