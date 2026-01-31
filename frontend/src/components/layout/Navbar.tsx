import React, { useState, useEffect } from 'react';
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
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '@/context/ThemeContext';
import LanguageSelector from '../common/LanguageSelector';
import { useAuthStore } from '@/context/AuthStore';

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
    const { mode, toggleColorMode } = useColorMode();
    const location = useLocation();
    
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const profile = useAuthStore((state) => state.profile);
    const fetchProfile = useAuthStore((state) => state.fetchProfile);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Removed local toggleLanguage as it's provided by context

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
            <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold' }}>
                {profile?.logoText?.split('.')[0] || "GM"}
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAuthenticated && (
                    <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/admin" sx={{ textAlign: 'center' }}>
                            <ListItemText primary={t('admin.dashboard')} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HideOnScroll>
                <AppBar position="fixed" color="default" elevation={0} sx={{
                    backdropFilter: 'blur(20px)',
                    backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            {/* Mobile Menu Icon */}
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { lg: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Logo */}
                            <Typography
                                variant="h6"
                                component={RouterLink}
                                to="/"
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                {profile?.logoText ? (
                                    <>
                                        {profile.logoText.split('.')[0]}
                                        <Box component="span" sx={{ color: 'primary.main' }}>.{profile.logoText.split('.')[1] || 'DEV'}</Box>
                                    </>
                                ) : (
                                    <>
                                        GONZALO<Box component="span" sx={{ color: 'primary.main' }}>.DEV</Box>
                                    </>
                                )}
                            </Typography>

                            {/* Desktop/Tablet Menu */}
                            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{
                                            color: location.pathname === item.path ? 'primary.main' : 'text.primary',
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

                            {/* Actions */}
                            <Box sx={{ ml: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                {isAuthenticated && (
                                    <Button
                                        component={RouterLink}
                                        to="/admin"
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        sx={{ 
                                            display: { xs: 'none', lg: 'inline-flex' },
                                            borderRadius: 20,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 2,
                                            py: 0.5,
                                            minHeight: 32,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {t('admin.dashboard')}
                                    </Button>
                                )}
                                <LanguageSelector />
                                <IconButton onClick={toggleColorMode} color="inherit" size="small">
                                    {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            {/* Drawer for Mobile */}
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            {/* Spacer for fixed AppBar */}
            <Toolbar />
        </Box>
    );
};

export default Navbar;
