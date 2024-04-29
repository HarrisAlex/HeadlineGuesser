import React from 'react';

import Colors from '../constants/Colors.jsx';

export default class TextBox extends React.Component {
    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.state = {
            value: "",
            focused: false,
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
            <div className="text-box" onChange={this.handleChange} style={{
                position: "relative",
                width: "100%"
            }}>
                <label htmlFor={this.props.label} style={{
                    transition: "all 0.25s ease",
                    paddingLeft: "0.3rem",
                    paddingRight: "0.3rem",
                    backgroundColor: Colors.Background(),
                    color: color,
                    position: "absolute",
                    top: "-0.75rem",
                    left: "0.75rem",
                    zIndex: "1",

                }}>{this.props.label}</label>
                <input onFocus={this.handleFocus} onBlur={this.handleBlur} id={this.props.label} style={{
                    position: "relative",
                    color: Colors.Text(),
                    backgroundColor: Colors.Background(),
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: color,
                    outlineWidth: "0",
                    padding: "0.7em",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    width: "100%",
                    transition: "all 0.25s ease",
                    boxShadow: this.state.focused ? "0 0 8px 0" + Colors.Accent(3) : "",
                    "--autofill-bg": Colors.Background(),
                    "--autofill-text": color,
                }}
                {...this.props}></input>
            </div>
        );
    }
}