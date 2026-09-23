import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import type { AlertColor } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import { useContactForm } from '../model/useContactForm';

interface ContactFormProps {
    onShowNotification: (message: string, severity?: AlertColor, duration?: number) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onShowNotification }) => {
    const { t } = useTranslation();
    const { formData, loading, handleChange, handleSubmit } = useContactForm(onShowNotification);

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
                label={t('contact.form.name', "Name")}
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
            />
            <TextField
                label={t('contact.form.email', "Email")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
            />
            <TextField
                label={t('contact.form.message', "Message")}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
            />

            <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={loading}
                sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 2
                }}
            >
                {loading ? t('common.sending', "Sending...") : t('contact.form.submit', "Send Message")}
            </Button>
        </Box>
    );
};

export default ContactForm;
