import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmColor = 'error'
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    {t('admin.cancel', 'Cancel')}
                </Button>
                <Button onClick={onConfirm} color={confirmColor} variant="contained" autoFocus>
                    {t('admin.confirm', 'Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
