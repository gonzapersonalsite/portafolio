import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { i18n } from '@/shared/config';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm" sx={{ py: 12 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                            textAlign: 'center',
                        }}
                    >
                        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
                        <Typography variant="h4" fontWeight="bold">
                            {i18n.t('common.errorBoundaryTitle')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {i18n.t('common.errorBoundaryDescription')}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => window.location.reload()}
                        >
                            {i18n.t('common.errorBoundaryRefresh')}
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
