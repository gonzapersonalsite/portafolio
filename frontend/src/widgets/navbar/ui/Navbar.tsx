import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    useScrollTrigger,
    Container,
    Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '@/features/language-switch';
import { ThemeSelector, useColorMode } from '@/features/theme-switch';
import { getProfile } from '@/entities/profile';
import { glassEffects } from '@/shared/config';
import { useContent } from '@/shared/lib';

interface Props {
    children: React.ReactElement;
}

function HideOnScroll(props: Props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useTranslation();
    const { mode } = useColorMode();
    const location = useLocation();
    const isGlass = mode === 'glass';
    const textColor = isGlass ? '#0b0a1c' : 'inherit';
    
    const { data: profile } = useContent(() => getProfile());

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { label: t('nav.home'), path: '/' },
        { label: t('nav.about'), path: '/about' },
        { label: t('nav.skills'), path: '/skills' },
        { label: t('nav.experience'), path: '/experience' },
        { label: t('nav.projects'), path: '/projects' },
        { label: t('nav.contact'), path: '/contact' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ my: 2, fontWeight: 'bold' }}>
                {profile?.logoText?.split('.')[0]}
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HideOnScroll>
                <AppBar position="fixed" color="default" elevation={0} sx={{
                    backdropFilter: isGlass ? glassEffects.blur : 'none',
                    backgroundColor: isGlass 
                        ? 'rgba(255, 255, 255, 0.4)' 
                        : (mode === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'),
                    borderBottom: isGlass ? glassEffects.border : '1px solid',
                    borderColor: 'divider',
                    color: textColor
                }}>
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            <IconButton
                                color="inherit"
                                aria-label={t('nav.openMenu')}
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { lg: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component={RouterLink}
                                to="/"
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: textColor,
                                    textDecoration: 'none',
                                }}
                            >
                                {profile?.logoText && (
                                    <>
                                        {profile.logoText.split('.')[0]}
                                        <Box component="span" sx={{ color: 'primary.main' }}>.{profile.logoText.split('.')[1] || 'DEV'}</Box>
                                    </>
                                )}
                            </Typography>
                            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{
                                            color: location.pathname === item.path 
                                                ? 'primary.main' 
                                                : textColor,
                                            fontWeight: location.pathname === item.path ? 700 : 500,
                                            fontSize: '0.95rem',
                                            textTransform: 'none',
                                            minWidth: 'auto',
                                            px: 1.5,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                            <Box sx={{ ml: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                <LanguageSelector />
                                <ThemeSelector />
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Toolbar />
        </Box>
    );
};

export default Navbar;
