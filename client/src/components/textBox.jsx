import React from 'react';

export default class TextBox extends React.Component {
    render() {
        return (
            <div className="text-box">
                <label htmlFor={this.props.label}>{this.props.label}</label>
                <input id={this.props.label} {...this.props}></input>
            </div>
        );
    }
}