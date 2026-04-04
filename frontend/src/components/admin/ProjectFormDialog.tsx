import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { Project } from '@/types';

// Omit the ID and create a specific payload interface for the form
export interface ProjectPayload extends Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'imageUrls'> {
    imageUrls: string | string[]; // Allow string from textarea before parsing
}

interface ProjectFormDialogProps {
    open: boolean;
    editingProj: Project | null;
    onClose: () => void;
    onSubmit: (data: ProjectPayload) => Promise<void>;
    saving: boolean;
}

const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
    open,
    editingProj,
    onClose,
    onSubmit,
    saving
}) => {
    const { t } = useTranslation();
    const { control, register, handleSubmit, reset } = useForm<ProjectPayload>();

    // Reset form when it opens or editingProj changes
    React.useEffect(() => {
        if (open) {
            if (editingProj) {
                reset({
                    ...editingProj,
                    imageUrls: Array.isArray(editingProj.imageUrls) ? editingProj.imageUrls : [],
                });
            } else {
                reset({
                    titleEn: '',
                    titleEs: '',
                    descriptionEn: '',
                    descriptionEs: '',
                    imageUrls: [],
                    technologies: [],
                    githubUrl: '',
                    liveUrl: '',
                    type: 'WEB',
                    featured: false,
                    order: 1
                });
            }
        }
    }, [open, editingProj, reset]);

    const handleFormSubmit = async (data: ProjectPayload) => {
        await onSubmit(data);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            disableEnforceFocus
        >
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogTitle>
                    {editingProj ? `${t('admin.edit')} ${t('projects.title')}` : `${t('admin.add')} ${t('projects.title')}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.title')} (EN)`} {...register('titleEn', { required: true })} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={`${t('admin.title')} (ES)`} {...register('titleEs', { required: true })} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth multiline rows={3} label={`${t('admin.description')} (EN)`} {...register('descriptionEn')} />
                        </Grid>
                        <Grid size={12}>
                            <TextField fullWidth multiline rows={3} label={`${t('admin.description')} (ES)`} {...register('descriptionEs')} />
                        </Grid>
                        <Grid size={12}>
                            <Controller
                                name="imageUrls"
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label={t('admin.imageUrls')}
                                        placeholder="https://..."
                                        value={Array.isArray(field.value) ? field.value.join('\n') : (field.value || '')}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Controller
                                name="technologies"
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label={t('admin.technologies')}
                                        placeholder="React, Java, AWS"
                                        value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                        onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>{t('admin.projectType')}</InputLabel>
                                <Controller
                                    name="type"
                                    control={control}
                                    defaultValue="WEB"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label={t('admin.projectType')}
                                        >
                                            <MenuItem value="WEB">WEB</MenuItem>
                                            <MenuItem value="DESKTOP">DESKTOP</MenuItem>
                                            <MenuItem value="MOBILE">MOBILE</MenuItem>
                                            <MenuItem value="OTHER">OTHER</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={t('admin.githubUrl')} {...register('githubUrl')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label={t('admin.liveUrl')} {...register('liveUrl')} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="featured"
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={!!field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        )}
                                    />
                                }
                                label={t('admin.featured')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth type="number" label={t('admin.order')} {...register('order', { valueAsNumber: true })} />
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

export default ProjectFormDialog;