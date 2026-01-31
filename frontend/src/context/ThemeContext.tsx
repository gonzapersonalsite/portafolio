import React, { useMemo, useState, createContext, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import createAppTheme from '../config/theme';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
    mode: ColorMode;
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
    mode: 'light',
    toggleColorMode: () => { },
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<ColorMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as ColorMode) || (prefersDarkMode ? 'dark' : 'light');
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [mode]
    );

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
};
