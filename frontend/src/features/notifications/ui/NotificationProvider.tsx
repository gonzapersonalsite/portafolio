import React, { useState, useCallback } from 'react';
import { Snackbar, Alert, type AlertColor, useTheme } from '@mui/material';
import { NotificationContext } from '@/features/notifications/model/NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [duration, setDuration] = useState(10000);

    const showNotification = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 10000) => {
        setMessage(msg);
        setSeverity(sev);
        setDuration(dur);
        setOpen(true);
    }, []);

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
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};
