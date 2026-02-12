import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField,
    CircularProgress, Alert, Slider, Snackbar, useMediaQuery, Card, CardContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { adminService } from '@/services/adminService';
import type { SpokenLanguage } from '@/types';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const SpokenLanguageManagement: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [languages, setLanguages] = useState<SpokenLanguage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState<SpokenLanguage | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<SpokenLanguage, 'id'>>({
        nameEn: '',
        nameEs: '',
        levelEn: '',
        levelEs: '',
        proficiency: 100,
        order: 0
    });

    const fetchLanguages = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSpokenLanguages();
            setLanguages(data);
            setError(null);
        } catch (err) {
            setError(t('admin.fetchError'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const handleOpenDialog = (lang?: SpokenLanguage) => {
        if (lang) {
            setEditingLanguage(lang);
            setFormData({
                nameEn: lang.nameEn,
                nameEs: lang.nameEs,
                levelEn: lang.levelEn,
                levelEs: lang.levelEs,
                proficiency: lang.proficiency,
                order: lang.order
            });
        } else {
            setEditingLanguage(null);
            setFormData({
                nameEn: '',
                nameEs: '',
                levelEn: '',
                levelEs: '',
                proficiency: 100,
                order: languages.length + 1
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingLanguage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            if (editingLanguage) {
                await adminService.updateSpokenLanguage(editingLanguage.id, formData);
            } else {
                await adminService.createSpokenLanguage(formData);
            }
            setSuccessMessage(t('admin.saveSuccess'));
            handleCloseDialog();
            fetchLanguages();
        } catch (err) {
            setError(t('admin.saveError'));
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
                setSuccessMessage(t('admin.deleteSuccess'));
                fetchLanguages();
            } catch (err) {
                setError(t('admin.deleteError'));
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingLanguage ? `${t('admin.edit')} ${t('nav.languages')}` : `${t('admin.add')} ${t('nav.languages')}`}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField name="nameEn" label={`${t('admin.name')} (EN)`} value={formData.nameEn} onChange={handleInputChange} fullWidth />
                        <TextField name="nameEs" label={`${t('admin.name')} (ES)`} value={formData.nameEs} onChange={handleInputChange} fullWidth />
                        <TextField name="levelEn" label={`${t('admin.level')} (EN)`} value={formData.levelEn} onChange={handleInputChange} fullWidth />
                        <TextField name="levelEs" label={`${t('admin.level')} (ES)`} value={formData.levelEs} onChange={handleInputChange} fullWidth />
                        <Box>
                            <Typography gutterBottom>{t('admin.proficiency')} ({formData.proficiency}%)</Typography>
                            <Slider
                                value={formData.proficiency}
                                onChange={(_, val) => setFormData(prev => ({ ...prev, proficiency: val as number }))}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100}
                            />
                        </Box>
                        <TextField name="order" label={t('admin.order')} type="number" value={formData.order} onChange={handleInputChange} fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t('admin.cancel')}</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={saving}>
                        {saving ? t('admin.saving') : t('admin.save')}
                    </Button>
                </DialogActions>
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

export default SpokenLanguageManagement;
