import React from 'react';
import { Container, Box } from '@mui/material';
import { ResetPasswordForm } from '@/features/auth';
import { LanguageSelector } from '@/features/language-switch';
import { usePageMeta } from '@/shared/lib';

const ResetPasswordPage: React.FC = () => {
    usePageMeta({ title: 'Reset Password | Gonzalo Martinez' });

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Container maxWidth="xs">
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <LanguageSelector />
                </Box>
                <ResetPasswordForm />
            </Container>
        </Box>
    );
};

export default ResetPasswordPage;
