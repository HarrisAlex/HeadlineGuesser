import React from 'react';

export default class Button extends React.Component {
    render() {
        return (
            <div>
                <button type="submit">{this.props.label}</button>
            </div>
        );
    }
}