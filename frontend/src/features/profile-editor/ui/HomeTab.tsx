import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/entities/profile';

interface HomeTabProps {
    profile: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ profile, onChange }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <TextField name="imageUrl" label={t('admin.imageUrl')} value={profile.imageUrl} onChange={onChange} fullWidth placeholder="https://..." />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {t('admin.imageUrlHint')}
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="greetingEn" label={`${t('admin.name')} (EN)`} value={profile.greetingEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="greetingEs" label={`${t('admin.name')} (ES)`} value={profile.greetingEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="titleEn" label={`${t('admin.title')} (EN)`} value={profile.titleEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="titleEs" label={`${t('admin.title')} (ES)`} value={profile.titleEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="subtitleEn" label={`${t('admin.subtitle')} (EN)`} value={profile.subtitleEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="subtitleEs" label={`${t('admin.subtitle')} (ES)`} value={profile.subtitleEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={12}>
                <TextField name="descriptionEn" label={`${t('admin.description')} (EN)`} value={profile.descriptionEn} onChange={onChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid size={12}>
                <TextField name="descriptionEs" label={`${t('admin.description')} (ES)`} value={profile.descriptionEs} onChange={onChange} fullWidth multiline rows={3} />
            </Grid>
        </Grid>
    );
};