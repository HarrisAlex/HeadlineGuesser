import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import LanguageSelectorButton from './languageSelectorButton.jsx';
import Button from './button.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

const languages = [
    { language: "english", display: Strings.English() },
    { language: "spanish", display: Strings.Spanish() },
    { language: "french", display: Strings.French() }
];

export default class LanguageSelector extends React.Component {
    static contextType = LanguageContext;

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    }
    
    render() {
        return (
            <LanguageContext.Consumer>
                {({ language, setLanguage }) => (
                    <div style={{
                        position: "absolute",
                        display: "flex",
                        top: "0rem",
                        left: "0rem",
                        width: "100svw",
                        height: "100svh",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}>
                        <div
                            style={{
                                display: this.state.open ? "flex" : "none",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: Colors.GlassPanel(),
                                backdropFilter: "blur(10px)",
                                border: "1px solid " + Colors.GlassPanelBorder(),
                                borderRadius: "1rem",
                                padding: "1rem",
                                width: "50svw",
                                height: "50svh",
                                gap: "1rem"
                            }}>
                            <h2>{Strings.ChooseLanguage(language)}</h2>
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    flexDirection: "column",
                                }}>
                                {languages.map((lang) => (
                                    <Button key={lang.language} label={lang.display} onClick={() => {
                                        localStorage.setItem("language", lang.language);
                                        setLanguage(lang.language);
                                        this.toggleOpen();
                                    }}/>
                                ))}
                            </div>
                        </div>
                        <LanguageSelectorButton onClick={this.toggleOpen} />
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }
}