import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/common/LanguageSelector';
import axios from 'axios';
import type { ResetPasswordRequest } from '@/types';

const ERROR_TRANSLATIONS: Record<string, string> = {
    'Invalid or expired reset token': 'admin.resetTokenInvalid',
    'This reset token has already been used': 'admin.resetTokenUsed',
    'This reset token has expired': 'admin.resetTokenExpired',
    'User not found': 'admin.resetUserNotFound',
};

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordRequest & { confirmPassword: string }>();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const onSubmit = async (data: ResetPasswordRequest & { confirmPassword: string }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.resetPassword({
                token: token,
                newPassword: data.newPassword
            });
            setMessage(t('admin.resetSuccess'));
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                const backendMsg = err.response.data?.message || '';
                const key = ERROR_TRANSLATIONS[backendMsg];
                setError(key ? t(key) : backendMsg || t('common.error'));
            } else {
                setError(t('common.error'));
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Container maxWidth="xs">
                <Box sx={{ mt: 8 }}>
                    <Alert severity="error">
                        {t('admin.invalidResetLink', 'Invalid reset link. No token provided.')}
                    </Alert>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/admin/login" style={{ color: '#1976d2' }}>
                            {t('admin.backToLogin', 'Back to login')}
                        </Link>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <LanguageSelector />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="bold">
                        {t('admin.resetPassword', 'Reset Password')}
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        {t('admin.resetPasswordInstructions', 'Enter your new password.')}
                    </Typography>

                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {!message && (
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label={t('admin.newPassword', 'New Password')}
                                type="password"
                                id="newPassword"
                                autoComplete="new-password"
                                autoFocus
                                {...register('newPassword', {
                                    required: true,
                                    minLength: { value: 4, message: t('admin.passwordMinLength', 'At least 4 characters') }
                                })}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label={t('admin.confirmPassword', 'Confirm Password')}
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                {...register('confirmPassword', {
                                    required: true,
                                    validate: (value) =>
                                        value === watch('newPassword') || t('admin.passwordsDoNotMatch', 'Passwords do not match')
                                })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
                            >
                                {loading ? t('common.loading') : t('admin.resetPassword', 'Reset Password')}
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/admin/login" style={{ color: '#1976d2' }}>
                            {t('admin.backToLogin', 'Back to login')}
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ResetPasswordPage;
