import React, { useEffect, useState } from 'react';
import {
    Box, Button, Typography, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Card, CardContent, CardActions, Checkbox, FormControlLabel, Grid,
    Snackbar, Alert, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import { adminService } from '@/services/adminService';
import type { Project } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formatImageUrl } from '@/utils/imageUtils';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import ScrollableContent from '@/components/common/ScrollableContent';

const ProjectsManagement: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [editingProj, setEditingProj] = useState<Project | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    const { control, register, handleSubmit, reset, setValue } = useForm<Project>();

    const fetchData = async () => {
        try {
            const data = await adminService.getProjects();
            setProjects(data);
        } catch (error) {
            setError(t('admin.fetchError'));
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (proj?: Project) => {
        if (proj) {
            setEditingProj(proj);
            setValue('titleEn', proj.titleEn);
            setValue('titleEs', proj.titleEs);
            setValue('descriptionEn', proj.descriptionEn);
            setValue('descriptionEs', proj.descriptionEs);
            setValue('imageUrl', proj.imageUrl);
            setValue('technologies', proj.technologies);
            setValue('githubUrl', proj.githubUrl);
            setValue('liveUrl', proj.liveUrl);
            setValue('featured', proj.featured);
            setValue('order', proj.order);
        } else {
            setEditingProj(null);
            reset({
                technologies: [],
                imageUrl: '',
                featured: false,
                order: projects.length + 1
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProj(null);
        reset();
    };

    const onSubmit = async (data: Project) => {
        try {
            setSaving(true);
            // Fix array inputs from text fields
            if (typeof data.technologies === 'string') {
                data.technologies = (data.technologies as string).split(',').map((t: string) => t.trim());
            }
            if (typeof data.imageUrl === 'string' && (data.imageUrl as string).includes(',')) {
                data.imageUrl = (data.imageUrl as string).split(',')[0].trim();
            }

            if (editingProj) {
                await adminService.updateProject(editingProj.id, data);
            } else {
                await adminService.createProject(data);
            }
            setSuccessMessage(t('admin.saveSuccess'));
            fetchData();
            handleClose();
        } catch (error) {
            setError(t('admin.saveError'));
            console.error('Error saving project:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            try {
                await adminService.deleteProject(projectToDelete);
                setSuccessMessage(t('admin.deleteSuccess'));
                fetchData();
            } catch (error) {
                setError(t('admin.deleteError'));
                console.error('Error deleting project:', error);
            } finally {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
            }
        }
    };

    return (
        <Box>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 3,
                gap: 2
            }}>
                <Typography variant="h4" fontWeight="bold">{t('admin.projects')}</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    {t('admin.add')}
                </Button>
            </Box>

            <Grid container spacing={3}>
                {projects.map((proj) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={proj.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative' }}>
                                <ImageWithFallback
                                    src={formatImageUrl(proj.imageUrl)}
                                    alt={proj.titleEn}
                                    type="project"
                                    aspectRatio="16/9"
                                    sx={{
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                    // @ts-ignore
                                    referrerPolicy="no-referrer"
                                />
                                {proj.featured && (
                                    <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper', borderRadius: '50%', p: 0.5, display: 'flex', boxShadow: 2, zIndex: 1 }}>
                                        <StarIcon color="warning" />
                                    </Box>
                                )}
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {proj.titleEn}
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                    <ScrollableContent maxHeight="100px" sx={{ bgcolor: 'action.hover', p: 1 }}>
                                        <RichTextRenderer text={proj.descriptionEn} variant="body2" />
                                    </ScrollableContent>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {proj.technologies?.map((tech) => (
                                        <Chip key={tech} label={tech} size="small" />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                <Button size="small" onClick={() => handleOpen(proj)}>{t('admin.edit')}</Button>
                                <Button size="small" color="error" onClick={() => handleDeleteClick(proj.id)}>{t('admin.delete')}</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title={t('admin.confirmDeleteTitle', 'Confirm Deletion')}
                message={t('admin.confirmDeleteMessage', 'Are you sure you want to delete this project? This action cannot be undone.')}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setProjectToDelete(null);
                }}
            />

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                <TextField
                                    fullWidth
                                    label={t('admin.imageUrl')}
                                    {...register('imageUrl')}
                                    placeholder="https://..."
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
                        <Button onClick={handleClose}>{t('admin.cancel')}</Button>
                        <Button type="submit" variant="contained" disabled={saving}>
                            {saving ? t('admin.saving') : t('admin.save')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Snackbars for notifications */}
            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
                <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProjectsManagement;
