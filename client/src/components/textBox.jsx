import React from 'react';

export default class TextBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
        }
    }
    render() {
        return (
            <div className="text-box">
                <label htmlFor={this.props.label}>{this.props.label}</label>
                <input id={this.props.label} name={this.props.label} type="text"></input>
            </div>
        );
    }
}