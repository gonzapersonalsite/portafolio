import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography,
    useMediaQuery, Card, CardContent, CardActions, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { adminService } from '@/services/adminService';
import type { Skill } from '@/types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useNotification } from '@/context/NotificationContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SkillFormDialog from '@/components/admin/SkillFormDialog';

const SkillsManagement: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [open, setOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { showNotification } = useNotification();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getSkills();
            setSkills(data);
        } catch (err) {
            showNotification(t('admin.fetchError'), 'error', 6000);
            console.error('Error fetching skills:', err);
        } finally {
            setLoading(false);
        }
    }, [showNotification, t]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleOpen = (skill?: Skill) => {
        setEditingSkill(skill || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSkill(null);
    };

    const onSubmit = async (data: Skill) => {
        try {
            setSaving(true);
            if (editingSkill) {
                await adminService.updateSkill(editingSkill.id, data);
            } else {
                await adminService.createSkill(data);
            }
            showNotification(t('admin.saveSuccess'), 'success', 6000);
            fetchSkills();
            handleClose();
        } catch (err) {
            showNotification(t('admin.saveError'), 'error', 6000);
            console.error('Error saving skill:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setSkillToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (skillToDelete) {
            try {
                await adminService.deleteSkill(skillToDelete);
                showNotification(t('admin.deleteSuccess'), 'success', 6000);
                fetchSkills();
            } catch (err) {
                showNotification(t('admin.deleteError'), 'error', 6000);
                console.error('Error deleting skill:', err);
            } finally {
                setDeleteDialogOpen(false);
                setSkillToDelete(null);
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
                <Typography variant="h4" fontWeight="bold">{t('admin.skills')}</Typography>
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
            {isMobile ? (
                <Box>
                    {skills.map((skill) => (
                        <Card key={skill.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {language === 'en' ? skill.nameEn : skill.nameEs}
                                        </Typography>
                                    </Box>
                                    <Chip 
                                        label={skill.category} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                    />
                                </Box>
                                
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" component="span" fontWeight="bold">
                                        {t('admin.level')}:
                                    </Typography>
                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                        {skill.level}%
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" component="span" fontWeight="bold">
                                        {t('admin.order')}:
                                    </Typography>
                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                        {skill.order}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => handleOpen(skill)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(skill.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.name')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.category')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.level')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.order')}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {skills.map((skill) => (
                                <TableRow key={skill.id} hover>
                                    <TableCell>{language === 'en' ? skill.nameEn : skill.nameEs}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ bgcolor: 'action.hover', px: 1, borderRadius: 1, display: 'inline-block' }}>
                                            {skill.category}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{skill.level}%</TableCell>
                                    <TableCell>{skill.order}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpen(skill)} color="primary" size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(skill.id)} color="error" size="small">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmDialog
                open={deleteDialogOpen}
                title={t('admin.confirmDeleteTitle')}
                message={t('admin.confirmDeleteMessage')}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setSkillToDelete(null);
                }}
            />

            </>)}

            {open && (
                <SkillFormDialog
                    open={open}
                    editingSkill={editingSkill}
                    onClose={handleClose}
                    onSubmit={onSubmit}
                    saving={saving}
                    defaultOrder={skills.length + 1}
                />
            )}
        </Box>
    );
};

export default SkillsManagement;
