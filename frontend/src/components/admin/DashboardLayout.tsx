import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import WorkIcon from '@mui/icons-material/Work';
import BuildIcon from '@mui/icons-material/Build';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import TranslateIcon from '@mui/icons-material/Translate';
import LinkIcon from '@mui/icons-material/Link';
import { useAuthStore } from '@/context/AuthStore';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: t('admin.profile', "Profile"), icon: <PersonIcon />, path: '/admin/profile' },
        { text: t('admin.skills'), icon: <BuildIcon />, path: '/admin/skills' },
        { text: t('admin.experiences'), icon: <WorkIcon />, path: '/admin/experiences' },
        { text: t('admin.projects'), icon: <CodeIcon />, path: '/admin/projects' },
        { text: t('admin.languages', "Languages"), icon: <TranslateIcon />, path: '/admin/languages' },
        { text: t('admin.externalResources'), icon: <LinkIcon />, path: '/admin/external-resources' },
    ];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        component="div"
                        key={item.text}
                        onClick={() => { navigate(item.path); setMobileOpen(false); }}
                        sx={{ cursor: 'pointer' }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { lg: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        {t('admin.dashboard')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ mr: 1 }}>
                            <LanguageSelector />
                        </Box>
                        <Button color="inherit" onClick={() => navigate('/')} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'inline-flex' } }}>
                            {t('admin.backToPublic')}
                        </Button>
                        <Button color="inherit" onClick={handleLogout} sx={{ whiteSpace: 'nowrap' }}>
                            {t('admin.logout')}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', lg: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { lg: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
