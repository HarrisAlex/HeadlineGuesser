import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from './button.jsx';

import Modal from './modal.jsx';
import Strings from '../constants/Strings.jsx';
import API from '../constants/API.jsx';

export default class LanguageSelector extends React.Component {
    static contextType = LanguageContext;

    constructor(props) {
        super(props);

        this.state = {
            languages: [{ language: "english", display: "English" }]
        };
    }

    componentDidMount() {
        // Get languages from backend
        API.get("/api/languages", (data) => {
            this.setState({ languages: data.languages });
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