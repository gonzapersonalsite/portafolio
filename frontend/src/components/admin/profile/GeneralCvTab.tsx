import React from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Profile } from '@/types';

interface GeneralCvTabProps {
    profile: Profile;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GeneralCvTab: React.FC<GeneralCvTabProps> = ({ profile, onChange }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3}>
            <Grid size={12}>
                <TextField name="cvUrl" label={t('admin.cvUrl')} value={profile.cvUrl} onChange={onChange} fullWidth placeholder="https://..." />
            </Grid>
        </Grid>
    );
};