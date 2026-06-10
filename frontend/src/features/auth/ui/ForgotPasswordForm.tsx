import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert, Link as MuiLink } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { authApi } from '@/entities/user';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { ForgotPasswordRequest } from '@/shared/lib/types';

const ForgotPasswordPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordRequest>();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async (data: ForgotPasswordRequest) => {
        try {
            setLoading(true);
            setError(null);
            await authApi.forgotPassword(data);
            setMessage(t('admin.resetEmailSent'));
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || t('common.error'));
            } else {
                setError(t('common.error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="bold">
                        {t('admin.forgotPasswordTitle', 'Forgot Password')}
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        {t('admin.forgotPasswordInstructions', 'Enter your username and we will send you a reset link.')}
                    </Typography>

                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {!message && (
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label={t('admin.username')}
                                autoComplete="username"
                                autoFocus
                                {...register('username', { required: true })}
                                error={!!errors.username}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
                            >
                                {loading ? t('common.loading') : t('admin.sendResetLink', 'Send Reset Link')}
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <MuiLink component={RouterLink} to="/admin/login" sx={{ fontSize: '0.875rem' }}>
                            {t('admin.backToLogin', 'Back to login')}
                        </MuiLink>
                    </Box>
                </Paper>
            </Box>
    );
};

export default ForgotPasswordPage;
