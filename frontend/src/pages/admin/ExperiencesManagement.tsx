import React, { useEffect, useState } from 'react';
import {
    Box, Button, Paper, IconButton, Typography, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Chip, Grid, Snackbar, Alert, useMediaQuery, Card, CardContent, CardActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { adminService } from '@/services/adminService';
import type { Experience } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RichTextRenderer from '@/components/common/RichTextRenderer';

const ExperiencesManagement: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [open, setOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { control, register, handleSubmit, reset, setValue } = useForm<Experience>();

    const fetchData = async () => {
        try {
            const data = await adminService.getExperiences();
            setExperiences(data);
        } catch (err) {
            setError(t('admin.fetchError'));
            console.error('Error fetching experiences:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (exp?: Experience) => {
        if (exp) {
            setEditingExp(exp);
            setValue('companyEn', exp.companyEn);
            setValue('companyEs', exp.companyEs);
            setValue('positionEn', exp.positionEn);
            setValue('positionEs', exp.positionEs);
            setValue('descriptionEn', exp.descriptionEn);
            setValue('descriptionEs', exp.descriptionEs);
            setValue('startDate', exp.startDate);
            setValue('endDate', exp.endDate);
            setValue('technologies', exp.technologies);
            setValue('order', exp.order);
        } else {
            setEditingExp(null);
            reset({ technologies: [], order: experiences.length + 1 });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingExp(null);
        reset();
    };

    const onSubmit = async (data: Experience) => {
        try {
            setSaving(true);
            // Ensure technologies is an array if edited manually
            if (typeof data.technologies === 'string') {
                data.technologies = (data.technologies as string).split(',').map((t: string) => t.trim());
            }

            if (editingExp) {
                await adminService.updateExperience(editingExp.id, data);
            } else {
                await adminService.createExperience(data);
            }
            setSuccessMessage(t('admin.saveSuccess'));
            fetchData();
            handleClose();
        } catch (err) {
            setError(t('admin.saveError'));
            console.error('Error saving experience:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setExperienceToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (experienceToDelete) {
            try {
                await adminService.deleteExperience(experienceToDelete);
                setSuccessMessage(t('admin.deleteSuccess'));
                fetchData();
            } catch (err) {
                setError(t('admin.deleteError'));
                console.error('Error deleting experience:', err);
            } finally {
                setDeleteDialogOpen(false);
                setExperienceToDelete(null);
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
                <Typography variant="h4" fontWeight="bold">{t('admin.experiences')}</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    {t('admin.add')}
                </Button>
            </Box>

            {isMobile ? (
                <Box>
                    {experiences.map((exp) => (
                        <Card key={exp.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {exp.companyEn}
                                        </Typography>
                                        <Typography color="text.secondary" gutterBottom>
                                            {exp.positionEn}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={`${exp.startDate} - ${exp.endDate || t('common.present')}`} 
                                        size="small" 
                                        variant="outlined" 
                                        color="primary"
                                    />
                                </Box>
                                
                                <Box sx={{ mt: 1 }}>
                                    <RichTextRenderer text={exp.descriptionEn} />
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                    {exp.technologies?.map((tech) => (
                                        <Chip key={tech} label={tech} size="small" />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <IconButton color="primary" onClick={() => handleOpen(exp)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDeleteClick(exp.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Paper sx={{ p: 2 }}>
                    <Timeline position="alternate">
                        {experiences.map((exp) => (
                            <TimelineItem key={exp.id}>
                                <TimelineOppositeContent color="text.secondary">
                                    {exp.startDate} - {exp.endDate || t('common.present')}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot color="primary" />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" component="span" fontWeight="bold">
                                            {exp.companyEn}
                                        </Typography>
                                        <Box>
                                            <IconButton size="small" color="primary" onClick={() => handleOpen(exp)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(exp.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Box>
                                    </Box>
                                    <Typography color="text.secondary">{exp.positionEn}</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {exp.technologies?.map((tech) => (
                                            <Chip key={tech} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                        ))}
                                    </Box>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </Paper>
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                title={t('admin.confirmDeleteTitle')}
                message={t('admin.confirmDeleteMessage')}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setExperienceToDelete(null);
                }}
            />

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            <Grid size={{ xs: 12, md: 8 }}>
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
                                            onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
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

export default ExperiencesManagement;
