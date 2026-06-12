import React, { useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/shared/config';
import { ColorModeContext, type ColorMode } from '@/features/theme-switch/model/ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<ColorMode>(() => {
        const savedMode = localStorage.getItem('themeMode') as ColorMode;
        const validModes: ColorMode[] = ['light', 'dark', 'glass'];
        
        if (savedMode && validModes.includes(savedMode)) {
            return savedMode;
        }

        if (typeof window !== 'undefined' && window.matchMedia) {
            const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            return isLight ? 'light' : 'dark';
        }
        
        return 'dark';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            mode,
            toggleColorMode: (newMode?: ColorMode) => {
                if (newMode) {
                    setMode(newMode);
                } else {
                    setMode((prevMode) => {
                        if (prevMode === 'light') return 'dark';
                        if (prevMode === 'dark') return 'glass';
                        return 'light';
                    });
                }
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
