import React, { useId, useState } from 'react';
import { Button, Menu, MenuItem, Typography, Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTranslation } from 'react-i18next';
import { COLOR_MODES, type ColorMode } from '@/shared/config';
import { useColorMode } from '../model/ThemeContext';

const MODE_ICONS: Record<ColorMode, React.ReactElement> = {
    light: <LightModeIcon fontSize="small" />,
    dark: <DarkModeIcon fontSize="small" />,
    glass: <AutoAwesomeIcon fontSize="small" />,
};

const ThemeSelector: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { mode, setColorMode } = useColorMode();
    const { t } = useTranslation();
    const buttonId = useId();
    const menuId = useId();
    const open = Boolean(anchorEl);

    const modeLabels: Record<ColorMode, string> = {
        light: t('common.theme.light'),
        dark: t('common.theme.dark'),
        glass: t('common.theme.glass'),
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleThemeChange = (selectedMode: ColorMode) => {
        if (mode !== selectedMode) {
            setColorMode(selectedMode);
        }
        handleClose();
    };

    return (
        <>
            {/* Below sm only the icon is shown, so the aria-label is the name; it keeps the visible label. */}
            <Button
                id={buttonId}
                onClick={handleOpen}
                color="inherit"
                startIcon={MODE_ICONS[mode]}
                aria-label={t('common.themeButton', { mode: modeLabels[mode] })}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={open ? menuId : undefined}
                sx={{
                    minWidth: 'auto',
                    px: 1,
                    // MUI's default icon margins (-4px / 8px) only make sense next to the text.
                    '& .MuiButton-startIcon': { ml: { xs: 0, sm: -0.5 }, mr: { xs: 0, sm: 1 } },
                }}
            >
                <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: 'inherit', fontWeight: 'bold', textTransform: 'uppercase', display: { xs: 'none', sm: 'inline' } }}
                >
                    {modeLabels[mode]}
                </Typography>
            </Button>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{ list: { 'aria-labelledby': buttonId } }}
            >
                {COLOR_MODES.map((option) => (
                    <MenuItem
                        key={option}
                        role="menuitemradio"
                        aria-checked={mode === option}
                        selected={mode === option}
                        onClick={() => handleThemeChange(option)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {MODE_ICONS[option]}
                            {modeLabels[option]}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default ThemeSelector;
