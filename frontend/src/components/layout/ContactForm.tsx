import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/context/NotificationContext';
import emailjs from '@emailjs/browser';

const ContactForm: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || serviceId === 'your_service_id' || !serviceId.startsWith('service_')) {
            setLoading(false);
            showNotification("EmailJS not configured correctly in .env.local (Service ID missing)", 'error', 6000);
            return;
        }

        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    title: "Portfolio Contact Message",
                    time: new Date().toLocaleString(),
                },
                publicKey
            );

            showNotification(t('contact.form.success', "Message sent successfully!"), 'success', 6000);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            console.error("EmailJS Error:", err);
            showNotification(t('common.error', "Failed to send message. Please try again later."), 'error', 6000);
        } finally {
            setLoading(false);
        }
    };

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
