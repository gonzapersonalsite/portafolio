import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            {/* Skip to Content Link */}
            <a href="#main-content" className="skip-link">
                {t('common.skipToContent', 'Skip to main content')}
            </a>

            <Navbar />
            <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1, outline: 'none' }}>
                <Outlet />
            </Box>

            <Footer />

            {/* Return to Top (Accessibility) */}
            <a href="#root" className="return-to-top" aria-label={t('common.returnToTop', 'Return to top')}>
                ↑
            </a>
        </Box>
    );
};

export default PublicLayout;
