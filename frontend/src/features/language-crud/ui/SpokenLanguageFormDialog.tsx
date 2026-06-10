import React, { useEffect } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SpokenLanguage } from '@/entities/spoken-language';

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
    const { control, register, handleSubmit, reset, watch } = useForm<Omit<SpokenLanguage, 'id'>>();
    const currentProficiency = watch('proficiency');

    useEffect(() => {
        if (open) {
            if (editingLanguage) {
                reset({
                    nameEn: editingLanguage.nameEn,
                    nameEs: editingLanguage.nameEs,
                    levelEn: editingLanguage.levelEn,
                    levelEs: editingLanguage.levelEs,
                    proficiency: editingLanguage.proficiency,
                    order: editingLanguage.order
                });
            } else {
                reset({
                    nameEn: '',
                    nameEs: '',
                    levelEn: '',
                    levelEs: '',
                    proficiency: 100,
                    order: defaultOrder
                });
            }
        }
    }, [open, editingLanguage, reset, defaultOrder]);

    const handleFormSubmit = async (data: Omit<SpokenLanguage, 'id'>) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableEnforceFocus>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    {editingLanguage ? `${t('admin.edit')} ${t('nav.languages')}` : `${t('admin.add')} ${t('nav.languages')}`}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label={`${t('admin.name')} (EN)`} {...register('nameEn', { required: true })} fullWidth />
                        <TextField label={`${t('admin.name')} (ES)`} {...register('nameEs', { required: true })} fullWidth />
                        <TextField label={`${t('admin.level')} (EN)`} {...register('levelEn', { required: true })} fullWidth />
                        <TextField label={`${t('admin.level')} (ES)`} {...register('levelEs', { required: true })} fullWidth />
                        <Box>
                            <Typography gutterBottom>{t('admin.proficiency')} ({currentProficiency ?? editingLanguage?.proficiency ?? 100}%)</Typography>
                            <Controller
                                name="proficiency"
                                control={control}
                                defaultValue={100}
                                render={({ field }) => (
                                    <Slider
                                        {...field}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={100}
                                    />
                                )}
                            />
                        </Box>
                        <TextField label={t('admin.order')} type="number" {...register('order', { required: true, valueAsNumber: true })} fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{t('admin.cancel')}</Button>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? t('admin.saving') : t('admin.save')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SpokenLanguageFormDialog;
