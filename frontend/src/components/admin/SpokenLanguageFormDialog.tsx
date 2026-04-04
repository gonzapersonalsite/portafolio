import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Slider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SpokenLanguage } from '@/types';

interface SpokenLanguageFormDialogProps {
    open: boolean;
    editingLanguage: SpokenLanguage | null;
    onClose: () => void;
    onSubmit: (data: Omit<SpokenLanguage, 'id'>) => Promise<void>;
    saving: boolean;
    defaultOrder: number;
}

const SpokenLanguageFormDialog: React.FC<SpokenLanguageFormDialogProps> = ({
    open,
    editingLanguage,
    onClose,
    onSubmit,
    saving,
    defaultOrder
}) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Omit<SpokenLanguage, 'id'>>({
        nameEn: '',
        nameEs: '',
        levelEn: '',
        levelEs: '',
        proficiency: 100,
        order: 0
    });

    useEffect(() => {
        if (open) {
            if (editingLanguage) {
                setFormData({
                    nameEn: editingLanguage.nameEn,
                    nameEs: editingLanguage.nameEs,
                    levelEn: editingLanguage.levelEn,
                    levelEs: editingLanguage.levelEs,
                    proficiency: editingLanguage.proficiency,
                    order: editingLanguage.order
                });
            } else {
                setFormData({
                    nameEn: '',
                    nameEs: '',
                    levelEn: '',
                    levelEs: '',
                    proficiency: 100,
                    order: defaultOrder
                });
            }
        }
    }, [open, editingLanguage, defaultOrder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
    };

    const handleFormSubmit = async () => {
        await onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableEnforceFocus>
            <DialogTitle>
                {editingLanguage ? `${t('admin.edit')} ${t('nav.languages')}` : `${t('admin.add')} ${t('nav.languages')}`}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField name="nameEn" label={`${t('admin.name')} (EN)`} value={formData.nameEn} onChange={handleInputChange} fullWidth />
                    <TextField name="nameEs" label={`${t('admin.name')} (ES)`} value={formData.nameEs} onChange={handleInputChange} fullWidth />
                    <TextField name="levelEn" label={`${t('admin.level')} (EN)`} value={formData.levelEn} onChange={handleInputChange} fullWidth />
                    <TextField name="levelEs" label={`${t('admin.level')} (ES)`} value={formData.levelEs} onChange={handleInputChange} fullWidth />
                    <Box>
                        <Typography gutterBottom>{t('admin.proficiency')} ({formData.proficiency}%)</Typography>
                        <Slider
                            value={formData.proficiency}
                            onChange={(_, val) => setFormData(prev => ({ ...prev, proficiency: val as number }))}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                        />
                    </Box>
                    <TextField name="order" label={t('admin.order')} type="number" value={formData.order} onChange={handleInputChange} fullWidth />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('admin.cancel')}</Button>
                <Button onClick={handleFormSubmit} variant="contained" disabled={saving}>
                    {saving ? t('admin.saving') : t('admin.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SpokenLanguageFormDialog;