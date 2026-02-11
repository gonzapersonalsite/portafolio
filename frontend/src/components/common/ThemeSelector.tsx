import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useColorMode } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeSelector: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { mode, toggleColorMode } = useColorMode();
    const { t } = useTranslation();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (selectedMode: 'light' | 'dark') => {
        if (mode !== selectedMode) {
            toggleColorMode();
        }
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                color="inherit"
                startIcon={mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                sx={{ minWidth: 'auto', px: 1 }}
            >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {mode.toUpperCase()}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => handleThemeChange('light')}
                    selected={mode === 'light'}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeIcon fontSize="small" />
                        {t('common.theme.light')}
                    </Box>
                </MenuItem>
                <MenuItem
                    onClick={() => handleThemeChange('dark')}
                    selected={mode === 'dark'}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeIcon fontSize="small" />
                        {t('common.theme.dark')}
                    </Box>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ThemeSelector;
