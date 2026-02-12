import React, { useEffect, useState } from 'react';
import {
    Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Slider,
    Select, MenuItem, InputLabel, FormControl, Grid, Snackbar, Alert,
    useMediaQuery, Card, CardContent, CardActions, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { adminService } from '@/services/adminService';
import type { Skill } from '@/types';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const SkillsManagement: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [open, setOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { control, register, handleSubmit, reset, setValue, watch } = useForm<Skill>();
    const currentLevel = watch('level');

    const fetchSkills = async () => {
        try {
            const data = await adminService.getSkills();
            setSkills(data);
        } catch (err) {
            setError(t('admin.fetchError'));
            console.error('Error fetching skills:', err);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleOpen = (skill?: Skill) => {
        if (skill) {
            setEditingSkill(skill);
            setValue('nameEn', skill.nameEn);
            setValue('nameEs', skill.nameEs);
            setValue('level', skill.level);
            setValue('category', skill.category);
            setValue('iconUrl', skill.iconUrl);
            setValue('order', skill.order);
        } else {
            setEditingSkill(null);
            reset({ level: 50, order: skills.length + 1 });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingSkill(null);
        reset();
    };

    const onSubmit = async (data: Skill) => {
        try {
            setSaving(true);
            if (editingSkill) {
                await adminService.updateSkill(editingSkill.id, data);
            } else {
                await adminService.createSkill(data);
            }
            setSuccessMessage(t('admin.saveSuccess'));
            fetchSkills();
            handleClose();
        } catch (err) {
            setError(t('admin.saveError'));
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
                setSuccessMessage(t('admin.deleteSuccess'));
                fetchSkills();
            } catch (err) {
                setError(t('admin.deleteError'));
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

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
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

export default SkillsManagement;
