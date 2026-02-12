import React, { useEffect, useState } from 'react';
import {
    Box, Button, Paper, IconButton, Typography, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    Chip, Grid, Snackbar, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { adminService } from '@/services/adminService';
import type { Experience } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import ScrollableContent from '@/components/common/ScrollableContent';

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
    const { language } = useLanguage();
    const theme = useTheme();

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

            <Paper sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
                <Timeline
                    position="right"
                    sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.3,
                        },
                        p: 0
                    }}
                >
                    {experiences.map((exp, index) => (
                        <TimelineItem key={exp.id}>
                            <TimelineOppositeContent color="text.secondary" sx={{ py: '12px', px: 2, display: { xs: 'none', md: 'block' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                    <CalendarMonthIcon fontSize="small" />
                                    <Typography variant="body2" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                        {exp.startDate} — {exp.endDate || t('common.present')}
                                    </Typography>
                                </Box>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot color={index === 0 ? "primary" : "grey"} variant={index === 0 ? "filled" : "outlined"}>
                                    <BusinessIcon />
                                </TimelineDot>
                                {index < experiences.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 4,
                                        width: '100%',
                                        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2
                                    }}
                                >
                                    {/* Header Row: Mobile Date + Actions */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                                            <CalendarMonthIcon fontSize="small" />
                                            <Typography variant="caption" fontWeight="bold">
                                                {exp.startDate} — {exp.endDate || t('common.present')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: { xs: 'none', md: 'block' } }} />

                                        <Box>
                                            <IconButton color="primary" onClick={() => handleOpen(exp)} size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteClick(exp.id)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" component="h3" fontWeight="bold" color="primary">
                                        {language === 'en' ? exp.positionEn : exp.positionEs}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                                        @{language === 'en' ? exp.companyEn : exp.companyEs}
                                    </Typography>
                                    
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <ScrollableContent maxHeight="200px">
                                            <RichTextRenderer text={language === 'en' ? exp.descriptionEn : exp.descriptionEs} variant="body2" />
                                        </ScrollableContent>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        {exp.technologies.map(tech => (
                                            <Chip key={tech} label={tech} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Paper>

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
