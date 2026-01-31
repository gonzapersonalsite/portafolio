import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'es';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState<Language>(
        (localStorage.getItem('language') as Language) || 'en'
    );

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    }, [language, i18n]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
