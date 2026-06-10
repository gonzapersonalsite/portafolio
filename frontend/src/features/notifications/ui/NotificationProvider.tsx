import React, { useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, type AlertColor, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { notificationEvents } from '@/shared/lib/notificationEvents';
import { NotificationContext } from '@/features/notifications/model/NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [messageKey, setMessageKey] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [duration, setDuration] = useState(10000);

    const showNotification = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 10000) => {
        setMessageKey(msg);
        setSeverity(sev);
        setDuration(dur);
        setOpen(true);
    }, []);

    useEffect(() => {
        const unsubscribe = notificationEvents.subscribe(({ message, severity }) => {
            showNotification(message, severity);
        });
        
        return () => {
            unsubscribe();
        };
    }, [showNotification]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: 7, zIndex: theme.zIndex.snackbar + 100 }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%', boxShadow: theme.shadows[3], borderRadius: `${theme.shape.borderRadius}px` }}>
                    {messageKey.includes('.') ? t(messageKey) : messageKey}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
