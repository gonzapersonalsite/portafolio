import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/context/AuthStore';
import apiClient from '@/services/apiClient';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/common/LanguageSelector';

const LoginPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // Clear error when language changes
    React.useEffect(() => {
        setError(null);
    }, [i18n.language]);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.post('/auth/login', data);
            login(response.data);
            navigate('/admin');
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setError(t('admin.invalidCredentials', 'Invalid credentials'));
            } else {
                setError(t('common.error', 'An error occurred. Please try again.'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <LanguageSelector />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="bold">
                        {t('admin.login')}
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        {t('admin.welcomeBack', 'Welcome back! Please enter your credentials.')}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label={t('admin.username')}
                            autoComplete="username"
                            autoFocus
                            {...register("username", { required: true })}
                            error={!!errors.username}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={t('admin.password')}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            {...register("password", { required: true })}
                            error={!!errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
                        >
                            {loading ? t('common.loading') : t('admin.login')}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
