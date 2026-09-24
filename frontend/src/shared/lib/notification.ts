import type { AlertColor } from '@mui/material';

// How any slice reports feedback to the visitor; features/notifications provides the implementation.
export type ShowNotification = (message: string, severity?: AlertColor, duration?: number) => void;
