import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Button, CircularProgress, Typography,
    Card, CardContent, CardActions, Grid,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CodeIcon from '@mui/icons-material/Code';
import { getProjects, createProject, updateProject, deleteProject } from '@/entities/project';
import type { Project } from '@/entities/project';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/features/language-switch';
import { useNotification } from '@/features/notifications';
import { usePageMeta } from '@/shared/lib';
import { formatImageUrl, parseUrlStringToArray, parseCommaSeparatedString } from '@/shared/lib';
import { ImageWithFallback, ConfirmDialog, RichTextRenderer, ScrollableContent } from '@/shared/ui';
import { ProjectFormDialog } from '@/features/project-crud';
import type { ProjectPayload } from '@/features/project-crud';

const ProjectsManagement: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [open, setOpen] = useState(false);
    const [editingProj, setEditingProj] = useState<Project | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { showNotification } = useNotification();

    usePageMeta({ title: `${t('admin.projects')} | Gonzalo Martinez` });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            showNotification(t('admin.fetchError'), 'error', 6000);
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    }, [showNotification, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
const handleOpen = (proj?: Project) => {
        setEditingProj(proj || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProj(null);
    };

    const onSubmit = async (data: ProjectPayload) => {
        try {
            setSaving(true);
            const payload = { 
                ...data,
                technologies: parseCommaSeparatedString(data.technologies),
                imageUrls: parseUrlStringToArray(data.imageUrls)
            };

            if (editingProj) {
                await updateProject(editingProj.id, payload);
            } else {
                await createProject(payload);
            }
            showNotification(t('admin.saveSuccess'), 'success', 6000);
            fetchData();
            handleClose();
        } catch (error) {
            showNotification(t('admin.saveError'), 'error', 6000);
            console.error('Error saving project:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
        setDeleteDialogOpen(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'WEB': return <LanguageIcon fontSize="small" />;
            case 'DESKTOP': return <DesktopWindowsIcon fontSize="small" />;
            case 'MOBILE': return <SmartphoneIcon fontSize="small" />;
            default: return <CodeIcon fontSize="small" />;
        }
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            try {
                await deleteProject(projectToDelete);
                showNotification(t('admin.deleteSuccess'), 'success', 6000);
                fetchData();
            } catch (error) {
                showNotification(t('admin.deleteError'), 'error', 6000);
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (<>
            <Grid container spacing={3}>
                {projects.map((proj) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={proj.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ position: 'relative' }}>
                                <ImageWithFallback
                                    src={Array.isArray(proj.imageUrls) && proj.imageUrls.length > 0 && proj.imageUrls[0] ? formatImageUrl(proj.imageUrls[0]) : ''}
                                    alt={language === 'en' ? proj.titleEn : proj.titleEs}
                                    type="project"
                                    aspectRatio="16/9"
                                    sx={{
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                    referrerPolicy="no-referrer"
                                />
                                <Chip
                                    label={t(`projects.types.${proj.type || 'WEB'}`)}
                                    icon={getTypeIcon(proj.type || 'WEB')}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        bgcolor: 'background.paper',
                                        color: 'text.primary',
                                        fontWeight: 'bold',
                                        boxShadow: 2,
                                        '& .MuiChip-icon': {
                                            color: 'primary.main'
                                        }
                                    }}
                                />
                                {proj.featured && (
                                    <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'background.paper', borderRadius: '50%', p: 0.5, display: 'flex', boxShadow: 2, zIndex: 1 }}>
                                        <StarIcon color="warning" />
                                    </Box>
                                )}
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {language === 'en' ? proj.titleEn : proj.titleEs}
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                    <ScrollableContent maxHeight="100px" sx={{ bgcolor: 'action.hover', p: 1 }}>
                                        <RichTextRenderer text={language === 'en' ? proj.descriptionEn : proj.descriptionEs} variant="body2" />
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
                disableEnforceFocus
            />

            {/* Project Form Dialog */}
            </>)}

            {open && (
                <ProjectFormDialog
                    open={open}
                    editingProj={editingProj}
                    onClose={handleClose}
                    onSubmit={onSubmit}
                    saving={saving}
                />
            )}
        </Box>
    );
};

export default ProjectsManagement;
