import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSelector: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { language, setLanguage } = useLanguage();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang: 'en' | 'es') => {
        setLanguage(lang);
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                color="inherit"
                startIcon={<TranslateIcon fontSize="small" />}
                sx={{ minWidth: 'auto', px: 1 }}
            >
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    {language.toUpperCase()}
                </Typography>
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => handleLanguageChange('en')}
                    selected={language === 'en'}
                >
                    English
                </MenuItem>
                <MenuItem
                    onClick={() => handleLanguageChange('es')}
                    selected={language === 'es'}
                >
                    Español
                </MenuItem>
            </Menu>
        </>
    );
};

export default LanguageSelector;
