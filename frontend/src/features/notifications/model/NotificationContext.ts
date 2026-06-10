import { createContext, useContext } from 'react';
import type { AlertColor } from '@mui/material';

export interface NotificationContextType {
    showNotification: (message: string, severity?: AlertColor, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
