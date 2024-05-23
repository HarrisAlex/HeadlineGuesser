import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from './button.jsx';

import Modal from './modal.jsx';
import Strings from '../constants/Strings.jsx';

export default class LanguageSelector extends React.Component {
    static contextType = LanguageContext;

    constructor(props) {
        super(props);

        this.state = {
            languages: [{ language: "english", display: "English" }]
        };
    }

    componentDidMount() {
        fetch("/api/languages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
         }).then((data) => {
            // Check for successful response
             if (data.status === 200) {
                data.json().then((data) => {
                    this.setState({ languages: data.languages });
                });
             }
         });
    }

    render() {
        return (
            <LanguageContext.Consumer>
                {({ language, setLanguage, setLanguageIndex }) => (
                    <Modal close={this.props.close} header={Strings.ChooseLanguage(language)}>
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "space-evenly",
                                flexDirection: "column",
                            }}>
                            {this.state.languages.map((lang, index) => (
                                <Button key={lang.language} label={lang.display} onClick={() => {
                                    localStorage.setItem("language", lang.language);
                                    setLanguage(lang.language);
                                    setLanguageIndex(index);
                                }}/>
                            ))}
                        </div>
                    </Modal>
                )}
            </LanguageContext.Consumer>
        );
    }
}