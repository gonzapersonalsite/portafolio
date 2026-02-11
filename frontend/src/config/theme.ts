import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { glassColors, glassEffects } from '../styles/glassStyles';

const getThemeOptions = (mode: 'light' | 'dark' | 'glass'): ThemeOptions => {
    const isGlass = mode === 'glass';
    const muiMode = isGlass ? 'dark' : (mode === 'light' ? 'light' : 'dark');
    
    return {
        palette: {
            mode: muiMode,
            primary: {
                main: isGlass ? glassColors.neon.turquoise : (muiMode === 'light' ? '#1565c0' : '#90caf9'),
                light: isGlass ? glassColors.neon.turquoise : (muiMode === 'light' ? '#42a5f5' : '#e3f2fd'),
                dark: isGlass ? glassColors.neon.violet : (muiMode === 'light' ? '#0d47a1' : '#42a5f5'),
            },
            secondary: {
                main: isGlass ? glassColors.neon.pink : (muiMode === 'light' ? '#dc004e' : '#f48fb1'),
            },
            background: {
                default: isGlass ? glassColors.background.deep : (muiMode === 'light' ? '#f5f5f5' : '#121212'),
                paper: isGlass ? glassColors.background.glassStart : (muiMode === 'light' ? '#ffffff' : '#1e1e1e'),
            },
            ...(isGlass ? {
                text: {
                    primary: glassColors.text.primary,
                    secondary: glassColors.text.secondary,
                    disabled: glassColors.text.disabled,
                }
            } : {}),
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 700,
                fontSize: '3.5rem',
                lineHeight: 1.2,
                ...(isGlass && {
                    color: glassColors.text.primary,
                    textShadow: glassEffects.textShadow(glassColors.neon.turquoise),
                }),
            },
            h2: {
                fontWeight: 600,
                fontSize: '2.5rem',
                lineHeight: 1.3,
                ...(isGlass && {
                    color: glassColors.text.primary,
                    textShadow: glassEffects.textShadow(glassColors.neon.violet),
                }),
            },
            h3: {
                fontWeight: 600,
                fontSize: '2rem',
                lineHeight: 1.4,
                ...(isGlass && {
                    color: glassColors.text.primary,
                    textShadow: glassEffects.textShadow(glassColors.neon.pink),
                }),
            },
            h4: {
                fontWeight: 500,
                fontSize: '1.5rem',
                lineHeight: 1.4,
                ...(isGlass && {
                    color: glassColors.text.secondary,
                }),
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.6,
                ...(isGlass && {
                    color: glassColors.text.muted,
                }),
            },
            body2: {
                ...(isGlass && {
                    color: glassColors.text.caption,
                }),
            },
            caption: {
                ...(isGlass && {
                    color: glassColors.text.disabled,
                }),
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        ...(isGlass && {
                            backdropFilter: glassEffects.blur,
                            background: `linear-gradient(135deg, ${glassColors.background.glassStart}, ${glassColors.background.glassEnd})`,
                            border: glassEffects.border,
                            boxShadow: glassEffects.innerBoxShadow,
                            color: glassColors.text.primary,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: `linear-gradient(135deg, ${glassColors.background.glassEnd}, ${glassColors.background.glassStart})`,
                                boxShadow: `0 0 20px ${glassColors.neon.turquoise}`,
                                transform: 'translateY(-2px)',
                            },
                        }),
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: isGlass 
                            ? glassEffects.outerBoxShadow
                            : (muiMode === 'light' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.3)'),
                        ...(isGlass && {
                            backdropFilter: glassEffects.blur,
                            background: `linear-gradient(135deg, ${glassColors.background.glassStart}, ${glassColors.background.glassEnd})`,
                            border: glassEffects.border,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 20px ${glassColors.neon.violet}40`,
                                '&::after': {
                                    opacity: 1,
                                }
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                boxShadow: glassEffects.innerBoxShadow,
                                pointerEvents: 'none',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `radial-gradient(circle at 50% 0%, ${glassColors.neon.violet}15, transparent 70%)`,
                                opacity: 0,
                                transition: 'opacity 0.4s ease',
                                pointerEvents: 'none',
                            }
                        }),
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        ...(isGlass && {
                            backdropFilter: glassEffects.blur,
                            background: `linear-gradient(135deg, ${glassColors.background.glassStart}, ${glassColors.background.glassEnd})`,
                            border: glassEffects.border,
                            boxShadow: glassEffects.outerBoxShadow,
                        }),
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        ...(isGlass && {
                            backdropFilter: glassEffects.blur,
                            background: 'rgba(3, 3, 20, 0.5)',
                            borderBottom: glassEffects.border,
                            boxShadow: 'none',
                        }),
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        ...(isGlass && {
                            backdropFilter: glassEffects.blur,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '0.5px solid rgba(255, 255, 255, 0.1)',
                            color: glassColors.text.primary,
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: `0 0 10px ${glassColors.neon.pink}`,
                            }
                        }),
                    },
                },
            },
        },
        shape: {
            borderRadius: 8,
        },
    };
};

export const createAppTheme = (mode: 'light' | 'dark' | 'glass') => {
    return createTheme(getThemeOptions(mode));
};

export default createAppTheme;
