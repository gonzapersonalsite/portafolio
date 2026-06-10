import type { AlertColor } from '@mui/material';

type NotificationEvent = {
    message: string;
    severity: AlertColor;
};

type Listener = (event: NotificationEvent) => void;
const listeners = new Set<Listener>();

export const notificationEvents = {
    subscribe: (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    emit: (message: string, severity: AlertColor = 'info') => {
        listeners.forEach(listener => listener({ message, severity }));
    }
};
