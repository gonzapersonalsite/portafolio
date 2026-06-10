import React, { useEffect, useState } from 'react';
import {
    Box, Button, CircularProgress, Paper, IconButton, Typography,
    Chip
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
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useNotification } from '@/context/NotificationContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import ScrollableContent from '@/components/common/ScrollableContent';
import ExperienceFormDialog from '@/components/admin/ExperienceFormDialog';
import type { ExperiencePayload } from '@/components/admin/ExperienceFormDialog';
import { parseCommaSeparatedString } from '@/utils/sanitizers';

const ExperiencesManagement: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [open, setOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { showNotification } = useNotification();
    const theme = useTheme();

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await adminService.getExperiences();
            setExperiences(data);
        } catch (err) {
            showNotification(t('admin.fetchError'), 'error', 6000);
            console.error('Error fetching experiences:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpen = (exp?: Experience) => {
        setEditingExp(exp || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingExp(null);
    };

    const onSubmit = async (data: ExperiencePayload) => {
        try {
            setSaving(true);
            const payload = {
                ...data,
                technologies: parseCommaSeparatedString(data.technologies)
            };

            if (editingExp) {
                await adminService.updateExperience(editingExp.id, payload);
            } else {
                await adminService.createExperience(payload as Experience);
            }
            showNotification(t('admin.saveSuccess'), 'success', 6000);
            fetchData();
            handleClose();
        } catch (err) {
            showNotification(t('admin.saveError'), 'error', 6000);
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
                showNotification(t('admin.deleteSuccess'), 'success', 6000);
                fetchData();
            } catch (err) {
                showNotification(t('admin.deleteError'), 'error', 6000);
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (<>
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

            </>)}

            {open && (
                <ExperienceFormDialog
                    open={open}
                    editingExp={editingExp}
                    onClose={handleClose}
                    onSubmit={onSubmit}
                    saving={saving}
                />
            )}
        </Box>
    );
};

export default ExperiencesManagement;
