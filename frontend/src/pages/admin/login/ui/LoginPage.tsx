import React from 'react';
import { Container, Box } from '@mui/material';
import { LoginForm } from '@/features/auth';
import { LanguageSelector } from '@/features/language-switch';

const LoginPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                </Box>
                <LoginForm />
            </Container>
        </Box>
    );
};

export default LoginPage;
