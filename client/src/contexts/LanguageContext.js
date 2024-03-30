import { createContext, useContext, useState } from "react";

export const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem("language"));
    const [languageIndex, setLanguageIndex] = useState(0);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, languageIndex, setLanguageIndex }}>
            {children}
        </LanguageContext.Provider>
    );
};