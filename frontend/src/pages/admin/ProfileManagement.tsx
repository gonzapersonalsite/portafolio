import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper,
    CircularProgress, Tab, Tabs
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { useNotification } from '@/context/NotificationContext';
import { adminService } from '@/services/adminService';
import type { Profile } from '@/types';
import { HomeTab } from '@/components/admin/profile/HomeTab';
import { AboutTab } from '@/components/admin/profile/AboutTab';
import { GeneralCvTab } from '@/components/admin/profile/GeneralCvTab';
import { PersonalSocialTab } from '@/components/admin/profile/PersonalSocialTab';

const ProfileManagement: React.FC = () => {
    const { t } = useTranslation();
    const { showNotification } = useNotification();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [saving, setSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await adminService.getProfile();
            setProfile(data);
        } catch (err) {
            showNotification(t('admin.fetchError'), 'error', 6000);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSave = async () => {
        if (!profile) return;
        try {
            setSaving(true);
            await adminService.updateProfile(profile);
            showNotification(t('admin.saveSuccess'), 'success', 6000);
        } catch (err) {
            showNotification(t('admin.saveError'), 'error', 6000);
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

            <Paper sx={{ width: '100%', mb: 4 }}>
                <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} centered>
                    <Tab label={t('nav.home')} />
                    <Tab label={t('nav.about')} />
                    <Tab label={t('admin.generalCv')} />
                    <Tab label={t('admin.personalSocial')} />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {profile && (
                        <>
                            {tabValue === 0 && <HomeTab profile={profile} onChange={handleChange} />}
                            {tabValue === 1 && <AboutTab profile={profile} onChange={handleChange} />}
                            {tabValue === 2 && <GeneralCvTab profile={profile} onChange={handleChange} />}
                            {tabValue === 3 && <PersonalSocialTab profile={profile} onChange={handleChange} />}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileManagement;
