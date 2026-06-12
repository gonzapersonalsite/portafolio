import React from 'react';
import { Container, Box } from '@mui/material';
import { LoginForm } from '@/features/auth';
import { LanguageSelector } from '@/features/language-switch';
import { usePageMeta } from '@/shared/lib';

const LoginPage: React.FC = () => {
    usePageMeta({ title: 'Admin Login | Gonzalo Martinez' });

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
