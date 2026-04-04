import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/types';

interface PersonalSocialTabProps {
    profile: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalSocialTab: React.FC<PersonalSocialTabProps> = ({ profile, onChange }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="fullNameEn" label={`${t('admin.fullName')} (EN)`} value={profile.fullNameEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="fullNameEs" label={`${t('admin.fullName')} (ES)`} value={profile.fullNameEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="logoText" label={t('admin.logoText')} value={profile.logoText} onChange={onChange} fullWidth placeholder="GONZALO.DEV" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="email" label={t('admin.email')} value={profile.email} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="githubUrl" label={t('admin.githubUrl')} value={profile.githubUrl} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="linkedinUrl" label={t('admin.linkedinUrl')} value={profile.linkedinUrl} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="locationEn" label={`${t('admin.location')} (EN)`} value={profile.locationEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="locationEs" label={`${t('admin.location')} (ES)`} value={profile.locationEs} onChange={onChange} fullWidth />
            </Grid>
        </Grid>
    );
};