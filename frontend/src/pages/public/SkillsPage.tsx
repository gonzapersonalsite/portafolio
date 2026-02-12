import React, { useMemo } from 'react';
import { Box, Container, Typography, Grid, LinearProgress, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { publicService } from '@/services/publicService';
import type { Skill } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { SkillsSkeleton, PageHeaderSkeleton } from '@/components/common/SkeletonLoaders';
import EmptyState from '@/components/common/EmptyState';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { requestCache } from '@/utils/requestCache';
import i18n from '@/config/i18n';

const SkillsPage: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    
    // Intentar obtener datos de caché inmediatamente para evitar skeletons innecesarios
    const cacheKey = `/public/skills?&lang=${i18n.language}`;
    const cachedSkills = requestCache.get<Skill[]>(cacheKey);
    
    const [skills, setSkills] = React.useState<Skill[]>(cachedSkills || []);
    const [loading, setLoading] = React.useState(!cachedSkills);

    React.useEffect(() => {
        const fetchSkills = async () => {
            try {
                // Si no hay caché, mostramos loading
                if (!cachedSkills) setLoading(true);
                
                const data = await publicService.getAllSkills();
                setSkills(data);
            } catch (err) {
                console.error("Failed to fetch skills", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [language]); // Recargar si cambia el idioma

    // Group skills by category
    const skillsByCategory = useMemo(() => {
        const groups: { [key: string]: typeof skills } = {};
        skills.forEach(skill => {
            if (!groups[skill.category]) {
                groups[skill.category] = [];
            }
            groups[skill.category].push(skill);
        });
        return groups;
    }, [skills]);

    if (loading) {
        return (
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <PageHeaderSkeleton />
                    <SkillsSkeleton />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" fontWeight="bold">
                    {t('nav.skills', "SKILLS")}
                </Typography>
                <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mb: 6 }}>
                    {t('skills.heading', "Technical Expertise")}
                </Typography>

                <Grid container spacing={4}>
                    {skills.length > 0 ? (
                        Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                            <Grid size={{ xs: 12, md: 6 }} key={category}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
                                        borderRadius: 4,
                                        border: `1px solid ${theme.palette.divider}`
                                    }}
                                >
                                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                                        {category}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {categorySkills.map((skill) => (
                                            <Box key={skill.id}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">
                                                        {language === 'en' ? skill.nameEn : skill.nameEs}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {skill.level}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={skill.level}
                                                    aria-label={language === 'en' ? skill.nameEn : skill.nameEs}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: 4,
                                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <EmptyState
                                title={t('admin.emptyState.skills.title', 'Unlocking Potential')}
                                description={t('admin.emptyState.skills.description', 'Skills are being honed and added. Stay tuned for updates.')}
                                icon={<PsychologyIcon />}
                            />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default SkillsPage;
