import { createContext, useContext } from 'react';

export type Language = 'en' | 'es';

export interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
