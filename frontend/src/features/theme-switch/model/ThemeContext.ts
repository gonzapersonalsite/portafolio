import { createContext, useContext } from 'react';

export type ColorMode = 'light' | 'dark' | 'glass';

export interface ColorModeContextType {
    mode: ColorMode;
    toggleColorMode: (newMode?: ColorMode) => void;
}

export const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const useColorMode = () => {
    const context = useContext(ColorModeContext);
    if (context === undefined) {
        throw new Error('useColorMode must be used within a ThemeProvider');
    }
    return context;
};
