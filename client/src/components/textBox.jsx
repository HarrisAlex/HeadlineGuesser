import React from 'react';

import Colors from '../constants/Colors.jsx';

export default class TextBox extends React.Component {
    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            focused: false
        }
    }

    handleFocus() {
        this.setState({ focused: true });
    }

    handleBlur() {
        this.setState({ focused: false });
    }

    render() {
        let color = this.state.focused ? Colors.Accent(3) : Colors.Text();
        
        return (
            <div className="text-box" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
            }}>
                <label htmlFor={this.props.label} style={{
                    fontSize: "1.25rem"
                }}>{this.props.label}</label>
                <input onFocus={this.handleFocus} onBlur={this.handleBlur} id={this.props.label} style={{
                    background: "none",
                    color: color,
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: color,
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    transition: "all 0.25s ease",
                    boxShadow: this.state.focused ? "0 0 8px 0" + Colors.Accent(3) : ""
                }}{...this.props}></input>
            </div>
        );
    }
}