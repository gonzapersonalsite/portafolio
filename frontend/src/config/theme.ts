import { createTheme, type ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: mode === 'light' ? '#1565c0' : '#90caf9', // Darker blue for better contrast
            light: mode === 'light' ? '#42a5f5' : '#e3f2fd',
            dark: mode === 'light' ? '#0d47a1' : '#42a5f5',
        },
        secondary: {
            main: mode === 'light' ? '#dc004e' : '#f48fb1',
        },
        background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 600,
            fontSize: '2.5rem',
            lineHeight: 1.3,
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.4,
        },
        h4: {
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'light'
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : '0 2px 8px rgba(0,0,0,0.3)',
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
    return createTheme(getThemeOptions(mode));
};

export default createAppTheme;
