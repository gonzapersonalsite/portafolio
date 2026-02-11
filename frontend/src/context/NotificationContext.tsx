import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, type AlertColor, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { notificationEvents } from '@/utils/notificationEvents';

interface NotificationContextType {
    showNotification: (message: string, severity?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [messageKey, setMessageKey] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showNotification = useCallback((msg: string, sev: AlertColor = 'info') => {
        setMessageKey(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    useEffect(() => {
        // Suscribirse a eventos externos (como los del apiClient)
        const unsubscribe = notificationEvents.subscribe(({ message, severity }) => {
            showNotification(message, severity);
        });
        
        return () => {
            unsubscribe();
        };
    }, [showNotification]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ 
                    mt: 7,
                    zIndex: theme.zIndex.snackbar + 100 // Asegurar que esté por encima de otros elementos
                }}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={severity} 
                    variant="filled" 
                    sx={{ 
                        width: '100%',
                        boxShadow: theme.shadows[3],
                        borderRadius: `${theme.shape.borderRadius}px`
                    }}
                >
                    {messageKey.includes('.') ? t(messageKey) : messageKey}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
