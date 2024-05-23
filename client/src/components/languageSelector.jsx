import React from 'react';

import { LanguageContext } from '../contexts/LanguageContext.js';

import Button from './button.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

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
                    <div
                        style={{
                            position: "absolute",
                            top: "25svh",
                            left: "25svw",
                            display: "flex",
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
                            {this.state.languages.map((lang, index) => (
                                <Button key={lang.language} label={lang.display} onClick={() => {
                                    localStorage.setItem("language", lang.language);
                                    setLanguage(lang.language);
                                    setLanguageIndex(index);
                                }}/>
                            ))}
                        </div>
                        <Button type="close" onClick={this.props.close} />
                    </div>
                )}
            </LanguageContext.Consumer>
        );
    }
}