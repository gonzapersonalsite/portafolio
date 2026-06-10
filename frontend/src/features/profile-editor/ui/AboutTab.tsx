import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/entities/profile';

interface AboutTabProps {
    profile: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ profile, onChange }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <TextField name="imageUrl" label={t('admin.imageUrl')} value={profile.imageUrl} onChange={onChange} fullWidth placeholder="https://..." />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="aboutTitleEn" label={`${t('admin.title')} (EN)`} value={profile.aboutTitleEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="aboutTitleEs" label={`${t('admin.title')} (ES)`} value={profile.aboutTitleEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="aboutIntroTitleEn" label={`${t('admin.subtitle')} (EN)`} value={profile.aboutIntroTitleEn} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField name="aboutIntroTitleEs" label={`${t('admin.subtitle')} (ES)`} value={profile.aboutIntroTitleEs} onChange={onChange} fullWidth />
            </Grid>
            <Grid size={12}>
                <TextField name="aboutSummaryEn" label={`${t('admin.description')} (EN)`} value={profile.aboutSummaryEn} onChange={onChange} fullWidth multiline rows={4} />
            </Grid>
            <Grid size={12}>
                <TextField name="aboutSummaryEs" label={`${t('admin.description')} (ES)`} value={profile.aboutSummaryEs} onChange={onChange} fullWidth multiline rows={4} />
            </Grid>
            <Grid size={12}>
                <TextField name="aboutPhilosophyEn" label={`${t('admin.philosophy')} (EN)`} value={profile.aboutPhilosophyEn} onChange={onChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid size={12}>
                <TextField name="aboutPhilosophyEs" label={`${t('admin.philosophy')} (ES)`} value={profile.aboutPhilosophyEs} onChange={onChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid size={12}>
                <TextField name="sentenceEn" label={`${t('admin.sentence')} (EN)`} value={profile.sentenceEn || ''} onChange={onChange} fullWidth multiline rows={2} />
            </Grid>
            <Grid size={12}>
                <TextField name="sentenceEs" label={`${t('admin.sentence')} (ES)`} value={profile.sentenceEs || ''} onChange={onChange} fullWidth multiline rows={2} />
            </Grid>
        </Grid>
    );
};