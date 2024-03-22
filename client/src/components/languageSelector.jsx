import React from 'react';

import Button from './button.jsx';

import Strings from '../constants/Strings.jsx';
import Colors from '../constants/Colors.jsx';

const languages = [
    { language: "english", display: Strings.English() },
    { language: "spanish", display: Strings.Spanish() },
    { language: "french", display: Strings.French() }
];

export default class LanguageSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isHovered: false,
            listOpen: false
        };
    }

    handleHover = () => {
        this.setState({ isHovered: true });
    }

    handleUnhover = () => {
        this.setState({ isHovered: false });
    }

    handleClick = () => {
        this.setState({ listOpen: !this.state.listOpen });
    }
    
    render() {
        return (
            <div style={{
                position: "absolute",
                top: "0rem",
                left: "0rem",
                width: "100svw",
                height: "100svh",
                display: this.props.isOpen ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}>
                <div
                    style={{
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
                    <h2>{Strings.ChooseLanguage()}</h2>
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            justifyContent: "space-evenly",
                            flexDirection: "column",
                        }}>
                        {languages.map((language) => (
                            <Button key={language.language} label={language.display} onClick={() => {
                                localStorage.setItem("language", language.language)
                            }}/>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}