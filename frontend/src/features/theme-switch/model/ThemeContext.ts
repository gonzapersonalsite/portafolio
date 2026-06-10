import { createContext, useContext } from 'react';

export type ColorMode = 'light' | 'dark' | 'glass';

export interface ColorModeContextType {
    mode: ColorMode;
    toggleColorMode: (newMode?: ColorMode) => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'light',
    toggleColorMode: () => { },
});

export const useColorMode = () => useContext(ColorModeContext);
