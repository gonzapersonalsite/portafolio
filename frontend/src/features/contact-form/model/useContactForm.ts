import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { AlertColor } from '@mui/material';
import { ContactNotConfiguredError, sendContactMessage } from '../api/contactApi';
import type { ContactMessage } from './types';

type ShowNotification = (message: string, severity?: AlertColor, duration?: number) => void;

const emptyForm: ContactMessage = { name: '', email: '', message: '' };

export function useContactForm(showNotification: ShowNotification) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactMessage>(emptyForm);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await sendContactMessage(formData);
      showNotification(t('contact.form.success'), 'success', 6000);
      setFormData(emptyForm);
    } catch (error) {
      const message = error instanceof ContactNotConfiguredError
        ? t('contact.form.emailJsNotConfigured')
        : t('common.error');
      showNotification(message, 'error', 6000);
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleChange, handleSubmit };
}
