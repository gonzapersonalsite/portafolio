import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                gap: 2,
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
            <Typography variant="h6" color="error" textAlign="center">
                {message || t('common.error', 'An error occurred')}
            </Typography>
            {onRetry && (
                <Button variant="outlined" color="primary" onClick={onRetry}>
                    {t('common.retry', 'Retry')}
                </Button>
            )}
        </Box>
    );
};

export default ErrorState;
