import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    CircularProgress, useMediaQuery, Card, CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { adminService } from '@/services/adminService';
import type { SpokenLanguage } from '@/types';
import { useNotification } from '@/context/NotificationContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import SpokenLanguageFormDialog from '@/components/admin/SpokenLanguageFormDialog';

const SpokenLanguageManagement: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const { showNotification } = useNotification();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [languages, setLanguages] = useState<SpokenLanguage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<SpokenLanguage | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);

    const fetchLanguages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getSpokenLanguages();
            setLanguages(data);
        } catch (err) {
            showNotification(t('admin.fetchError'), 'error', 6000);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [showNotification, t]);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        fetchLanguages();
    }, [fetchLanguages]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const handleOpenDialog = (lang?: SpokenLanguage) => {
        setEditingLanguage(lang || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingLanguage(null);
    };

    const onSubmit = async (formData: Omit<SpokenLanguage, 'id'>) => {
        try {
            setSaving(true);
            if (editingLanguage) {
                await adminService.updateSpokenLanguage(editingLanguage.id, formData);
            } else {
                await adminService.createSpokenLanguage(formData);
            }
            showNotification(t('admin.saveSuccess'), 'success', 6000);
            handleCloseDialog();
            fetchLanguages();
        } catch (err) {
            showNotification(t('admin.saveError'), 'error', 6000);
            console.error('Failed to save language', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setLanguageToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (languageToDelete) {
            try {
                await adminService.deleteSpokenLanguage(languageToDelete);
                showNotification(t('admin.deleteSuccess'), 'success', 6000);
                fetchLanguages();
            } catch (err) {
                showNotification(t('admin.deleteError'), 'error', 6000);
                console.error('Failed to delete language', err);
            } finally {
                setDeleteDialogOpen(false);
                setLanguageToDelete(null);
            }
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

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
                <Typography variant="h4" fontWeight="bold">{t('admin.languages')}</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                    {t('admin.add')}
                </Button>
            </Box>

            {isMobile ? (
                <Box>
                    {languages.map((lang) => (
                        <Card key={lang.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {language === 'en' ? lang.nameEn : lang.nameEs}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    {language === 'en' ? lang.levelEn : lang.levelEs}
                                </Typography>
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" component="span" fontWeight="bold">
                                        {t('admin.proficiency')}:
                                    </Typography>
                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                        {lang.proficiency}%
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" component="span" fontWeight="bold">
                                        {t('admin.order')}:
                                    </Typography>
                                    <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                        {lang.order}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <IconButton color="primary" onClick={() => handleOpenDialog(lang)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteClick(lang.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.name')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.level')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.proficiency')}</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.order')}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {languages.map((lang) => (
                                <TableRow key={lang.id} hover>
                                    <TableCell>{language === 'en' ? lang.nameEn : lang.nameEs}</TableCell>
                                    <TableCell>{language === 'en' ? lang.levelEn : lang.levelEs}</TableCell>
                                    <TableCell>{lang.proficiency}%</TableCell>
                                    <TableCell>{lang.order}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" size="small" onClick={() => handleOpenDialog(lang)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton color="error" size="small" onClick={() => handleDeleteClick(lang.id)}><DeleteIcon fontSize="small" /></IconButton>
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
                    setLanguageToDelete(null);
                }}
            />

            {openDialog && (
                <SpokenLanguageFormDialog
                    open={openDialog}
                    editingLanguage={editingLanguage}
                    onClose={handleCloseDialog}
                    onSubmit={onSubmit}
                    saving={saving}
                    defaultOrder={languages.length + 1}
                />
            )}
        </Box>
    );
};

export default SpokenLanguageManagement;
