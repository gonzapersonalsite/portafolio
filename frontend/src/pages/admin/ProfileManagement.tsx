import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, TextField,
    CircularProgress, Alert, Tab, Tabs
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { adminService } from '@/services/adminService';
import type { Profile } from '@/types';

const ProfileManagement: React.FC = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await adminService.getProfile();
            setProfile(data);
            setError(null);
        } catch (err) {
            setError(t('admin.fetchError'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setSuccess(false);
    };

    const handleSave = async () => {
        if (!profile) return;
        try {
            setSaving(true);
            await adminService.updateProfile(profile);
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError(t('admin.saveError'));
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">{t('admin.profile')}</Typography>
                <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? t('admin.saving') : t('admin.save')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{t('admin.saveSuccess')}</Alert>}

            <Paper sx={{ width: '100%', mb: 4 }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} centered>
                    <Tab label={t('nav.home')} />
                    <Tab label={t('nav.about')} />
                    <Tab label="General / CV" />
                    <Tab label="Personal / Social" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {profile && (
                        <>
                            {tabValue === 0 && (
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <TextField name="imageUrl" label={t('admin.imageUrl')} value={profile.imageUrl} onChange={handleChange} fullWidth placeholder="https://..." />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            {t('admin.imageUrlHint')}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="greetingEn" label={`${t('admin.name')} (EN)`} value={profile.greetingEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="greetingEs" label={`${t('admin.name')} (ES)`} value={profile.greetingEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="titleEn" label={`${t('admin.title')} (EN)`} value={profile.titleEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="titleEs" label={`${t('admin.title')} (ES)`} value={profile.titleEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="subtitleEn" label={`${t('admin.subtitle')} (EN)`} value={profile.subtitleEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="subtitleEs" label={`${t('admin.subtitle')} (ES)`} value={profile.subtitleEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="descriptionEn" label={`${t('admin.description')} (EN)`} value={profile.descriptionEn} onChange={handleChange} fullWidth multiline rows={3} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="descriptionEs" label={`${t('admin.description')} (ES)`} value={profile.descriptionEs} onChange={handleChange} fullWidth multiline rows={3} />
                                    </Grid>
                                </Grid>
                            )}

                            {tabValue === 1 && (
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <TextField name="imageUrl" label={t('admin.imageUrl')} value={profile.imageUrl} onChange={handleChange} fullWidth placeholder="https://..." />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="aboutTitleEn" label={`${t('admin.title')} (EN)`} value={profile.aboutTitleEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="aboutTitleEs" label={`${t('admin.title')} (ES)`} value={profile.aboutTitleEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="aboutIntroTitleEn" label={`${t('admin.subtitle')} (EN)`} value={profile.aboutIntroTitleEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="aboutIntroTitleEs" label={`${t('admin.subtitle')} (ES)`} value={profile.aboutIntroTitleEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="aboutSummaryEn" label={`${t('admin.description')} (EN)`} value={profile.aboutSummaryEn} onChange={handleChange} fullWidth multiline rows={4} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="aboutSummaryEs" label={`${t('admin.description')} (ES)`} value={profile.aboutSummaryEs} onChange={handleChange} fullWidth multiline rows={4} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="aboutPhilosophyEn" label={`${t('admin.philosophy')} (EN)`} value={profile.aboutPhilosophyEn} onChange={handleChange} fullWidth multiline rows={3} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="aboutPhilosophyEs" label={`${t('admin.philosophy')} (ES)`} value={profile.aboutPhilosophyEs} onChange={handleChange} fullWidth multiline rows={3} />
                                    </Grid>

                                    <Grid size={12}>
                                        <TextField name="sentenceEn" label={`${t('admin.sentence')} (EN)`} value={profile.sentenceEn || ''} onChange={handleChange} fullWidth multiline rows={2} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField name="sentenceEs" label={`${t('admin.sentence')} (ES)`} value={profile.sentenceEs || ''} onChange={handleChange} fullWidth multiline rows={2} />
                                    </Grid>
                                </Grid>
                            )}

                            {tabValue === 2 && (
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <TextField name="cvUrl" label={t('admin.cvUrl')} value={profile.cvUrl} onChange={handleChange} fullWidth placeholder="https://..." />
                                    </Grid>
                                </Grid>
                            )}

                            {tabValue === 3 && (
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="fullNameEn" label={`${t('admin.fullName')} (EN)`} value={profile.fullNameEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="fullNameEs" label={`${t('admin.fullName')} (ES)`} value={profile.fullNameEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="logoText" label={t('admin.logoText')} value={profile.logoText} onChange={handleChange} fullWidth placeholder="GONZALO.DEV" />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="email" label={t('admin.email')} value={profile.email} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="githubUrl" label={t('admin.githubUrl')} value={profile.githubUrl} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="linkedinUrl" label={t('admin.linkedinUrl')} value={profile.linkedinUrl} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="locationEn" label={`${t('admin.location')} (EN)`} value={profile.locationEn} onChange={handleChange} fullWidth />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField name="locationEs" label={`${t('admin.location')} (ES)`} value={profile.locationEs} onChange={handleChange} fullWidth />
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileManagement;
