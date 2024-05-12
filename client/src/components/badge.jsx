import React from "react";

export default class Badge extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            badge: "",
            description: "",
            image: "",
            progress: 0,
        }
    }

    render() {
        return (
            <div {...this.props}>
                <img src={this.state.image} alt={this.state.badge} />
            </div>
        );
    }
}