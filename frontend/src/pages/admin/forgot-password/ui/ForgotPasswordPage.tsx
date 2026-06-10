import React from 'react';
import { Container, Box } from '@mui/material';
import { ForgotPasswordForm } from '@/features/auth';
import { LanguageSelector } from '@/features/language-switch';

const ForgotPasswordPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                </Box>
                <ForgotPasswordForm />
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
