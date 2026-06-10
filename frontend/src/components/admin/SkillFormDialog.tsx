import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Slider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Skill } from '@/types';

interface SkillFormDialogProps {
    open: boolean;
    editingSkill: Skill | null;
    onClose: () => void;
    onSubmit: (data: Skill) => Promise<void>;
    saving: boolean;
    defaultOrder: number;
}

const SkillFormDialog: React.FC<SkillFormDialogProps> = ({
    open,
    editingSkill,
    onClose,
    onSubmit,
    saving,
    defaultOrder
}) => {
    const { t } = useTranslation();
    const { control, register, handleSubmit, reset, watch } = useForm<Skill>();
    const currentLevel = watch('level');

    useEffect(() => {
        if (open) {
            if (editingSkill) {
                reset(editingSkill);
            } else {
                reset({
                    nameEn: '',
                    nameEs: '',
                    category: 'Backend',
                    iconUrl: '',
                    level: 50,
                    order: defaultOrder
                });
            }
        }
    }, [open, editingSkill, reset, defaultOrder]);

    const handleFormSubmit = async (data: Skill) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableEnforceFocus>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    {editingSkill ? `${t('admin.edit')} ${t('nav.skills')}` : `${t('admin.add')} ${t('nav.skills')}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={`${t('admin.name')} (EN)`}
                                {...register('nameEn', { required: true })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label={`${t('admin.name')} (ES)`}
                                {...register('nameEs', { required: true })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>{t('admin.category')}</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    defaultValue="Backend"
                                    render={({ field }) => (
                                        <Select {...field} label={t('admin.category')}>
                                            <MenuItem value="Backend">{t('admin.backend')}</MenuItem>
                                            <MenuItem value="Frontend">{t('admin.frontend')}</MenuItem>
                                            <MenuItem value="Database">{t('admin.database')}</MenuItem>
                                            <MenuItem value="Tools">{t('admin.tools')}</MenuItem>
                                            <MenuItem value="Other">{t('admin.other')}</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label={t('admin.order')}
                                {...register('order', { required: true, valueAsNumber: true })}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography gutterBottom>
                                {t('admin.level')}: {currentLevel ?? editingSkill?.level ?? 50}%
                            </Typography>
                            <Controller
                                name="level"
                                control={control}
                                defaultValue={50}
                                render={({ field }) => (
                                    <Slider
                                        {...field}
                                        valueLabelDisplay="auto"
                                        step={5}
                                        marks
                                        min={0}
                                        max={100}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label={t('admin.iconUrl')}
                                {...register('iconUrl')}
                                placeholder="https://..."
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

export default SkillFormDialog;