import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Strings from '../constants/Strings.jsx';

import Modal from './modal.jsx';
import Button from './button.jsx';
import API from '../constants/API.jsx';

export default class VerificationCodeModal extends React.Component {
    constructor(props) {
        super(props);

        this.onInputChange = this.onInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            code: "",
            closed: false
        }
    }

    onInputChange(event) {
        this.setState({ code: event.target.value });
    }

    handleSubmit() {
        // Send verification request to backend
        API.post("/api/verify", {
            token: localStorage.getItem("token"),
            code: this.state.code,
            action: this.props.action
        }, (data) => { sessionStorage.setItem("sensitiveToken", data.sensitiveToken); }, () => { console.error(Strings.VerificationFailed(localStorage.getItem("language"))); });

        this.setState({ closed: true });
    }

    render() {
        if (this.state.closed) return (<div></div>);

        return (
            <LanguageContext.Consumer>
                {(language) => (
                    <Modal header={Strings.EnterVerificationCode(language)}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                        }}>
                            <input type="text" style={{
                                width: "100%",
                                height: "2rem",
                                fontSize: "1rem",
                                textAlign: "center",
                                marginBottom: "1rem",
                            }} onChange={this.onInputChange}/>
                            {this.props.children}
                            <Button label={Strings.Submit(language)} onClick={this.handleSubmit} />
                        </div>
                    </Modal>
                )}
            </LanguageContext.Consumer>
        )
    }
}