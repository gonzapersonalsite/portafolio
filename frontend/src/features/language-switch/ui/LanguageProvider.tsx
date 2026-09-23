import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext, type Language } from '../model/LanguageContext';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { i18n } = useTranslation();
    
    const [language, setLanguage] = useState<Language>(() => {
        const currentLang = i18n.language?.split('-')[0];
        if (currentLang === 'en' || currentLang === 'es') {
            return currentLang as Language;
        }
        return (localStorage.getItem('language') as Language) || 'en';
    });

    useEffect(() => {
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
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
