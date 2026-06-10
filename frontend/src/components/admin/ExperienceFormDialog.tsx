import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Experience } from '@/types';

// Payload para parsear arrays de forma segura sin contaminar el componente principal
export interface ExperiencePayload extends Omit<Experience, 'id' | 'createdAt' | 'updatedAt' | 'technologies'> {
    technologies: string | string[];
}

interface ExperienceFormDialogProps {
    open: boolean;
    editingExp: Experience | null;
    onClose: () => void;
    onSubmit: (data: ExperiencePayload) => Promise<void>;
    saving: boolean;
}

const ExperienceFormDialog: React.FC<ExperienceFormDialogProps> = ({
    open,
    editingExp,
    onClose,
    onSubmit,
    saving,
}) => {
    const { t } = useTranslation();
    const { control, register, handleSubmit, reset } = useForm<ExperiencePayload>();

    useEffect(() => {
        if (open) {
            if (editingExp) {
                reset({
                    ...editingExp,
                    technologies: Array.isArray(editingExp.technologies) ? editingExp.technologies : [],
                });
            } else {
                reset({
                    companyEn: '',
                    companyEs: '',
                    positionEn: '',
                    positionEs: '',
                    descriptionEn: '',
                    descriptionEs: '',
                    startDate: '',
                    endDate: '',
                    technologies: [],
                });
            }
        }
    }, [open, editingExp, reset]);

    const handleFormSubmit = async (data: ExperiencePayload) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableEnforceFocus>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    {editingExp ? `${t('admin.edit')} ${t('nav.experience')}` : `${t('admin.add')} ${t('nav.experience')}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.company')} (EN)`} {...register('companyEn', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.company')} (ES)`} {...register('companyEs', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.position')} (EN)`} {...register('positionEn', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.position')} (ES)`} {...register('positionEs', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth type="date" label={t('admin.startDate')} InputLabelProps={{ shrink: true }} {...register('startDate', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth type="date" label={t('admin.endDate')} InputLabelProps={{ shrink: true }} {...register('endDate')} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth multiline rows={3} label={`${t('admin.description')} (EN)`} {...register('descriptionEn')} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth multiline rows={3} label={`${t('admin.description')} (ES)`} {...register('descriptionEs')} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name="technologies"
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label={t('admin.technologies')}
                                        placeholder="Java, React, SQL"
                                        value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
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

export default ExperienceFormDialog;