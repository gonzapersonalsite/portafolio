import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack, Chip, Divider, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '@mui/icons-material/Download';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';

import { useLanguage } from '@/context/LanguageContext';
import { publicService } from '@/services/publicService';
import { formatImageUrl } from '@/utils/imageUtils';
import { AboutSkeleton, PageHeaderSkeleton } from '@/components/common/SkeletonLoaders';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import type { Skill, Profile, SpokenLanguage } from '@/types';

const AboutPage: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const [competencies, setCompetencies] = React.useState<Skill[]>([]);
    const [spokenLanguages, setSpokenLanguages] = React.useState<SpokenLanguage[]>([]);
    const [profile, setProfile] = React.useState<Profile | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillsData, languagesData, profileData] = await Promise.all([
                    publicService.getAllSkills(),
                    publicService.getAllSpokenLanguages(),
                    publicService.getProfile()
                ]);

                setCompetencies(skillsData.filter((s: Skill) => s.level >= 70));
                setSpokenLanguages(languagesData);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch about data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to get localized text
    const getLocalizedText = (en: string, es: string) => {
        return language === 'en' ? (en || es) : (es || en);
    };

    if (loading) {
        return (
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <PageHeaderSkeleton />
                    <AboutSkeleton />
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" fontWeight="bold">
                    {t('nav.about', "ABOUT ME")}
                </Typography>
                <Typography variant="h2" component="h1" fontWeight="800" gutterBottom>
                    {profile ? getLocalizedText(profile.aboutTitleEn, profile.aboutTitleEs) : t('about.heading', "My Story")}
                </Typography>

                <Grid container spacing={6} sx={{ mt: 2 }}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <ImageWithFallback
                            src={formatImageUrl(profile?.imageUrl)}
                            alt={language === 'en' ? profile?.fullNameEn || "Profile" : profile?.fullNameEs || "Perfil"}
                            type="profile"
                            aspectRatio="1/1"
                            sx={{
                                maxWidth: 400,
                                margin: '0 auto',
                                display: 'block',
                                borderRadius: 4,
                                boxShadow: theme.shadows[10]
                            }}
                        />
                        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<DownloadIcon />}
                                href={profile?.cvUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                disabled={!profile?.cvUrl}
                            >
                                {t('home.resume', "Download CV")}
                            </Button>
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            {profile ? getLocalizedText(profile.aboutIntroTitleEn, profile.aboutIntroTitleEs) : t('about.introTitle')}
                        </Typography>
                        
                        <RichTextRenderer 
                            text={profile ? getLocalizedText(profile.aboutSummaryEn, profile.aboutSummaryEs) : t('about.summary')} 
                        />

                        <Box sx={{ mt: 2 }}>
                            <RichTextRenderer 
                                text={profile ? getLocalizedText(profile.aboutPhilosophyEn, profile.aboutPhilosophyEs) : t('about.philosophy')} 
                            />
                        </Box>

                        <Box sx={{ mt: 4, mb: 2, p: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                {t('about.sentenceTitle', "A sentence that defines me")}
                            </Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                                "{profile ? getLocalizedText(profile.sentenceEn, profile.sentenceEs) : ""}"
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CodeIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">Frontend</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {competencies
                                                    .filter(s => s.category.toLowerCase() === 'frontend')
                                                    .slice(0, 3)
                                                    .map(s => language === 'en' ? s.nameEn : s.nameEs)
                                                    .join(', ')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <WorkIcon color="secondary" sx={{ mr: 2, fontSize: 32 }} />
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">Backend</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {competencies
                                                    .filter(s => s.category.toLowerCase() === 'backend' || s.category.toLowerCase() === 'database')
                                                    .slice(0, 3)
                                                    .map(s => language === 'en' ? s.nameEn : s.nameEs)
                                                    .join(', ')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                                {t('about.skills', "Core Competencies")}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                                {competencies.length > 0 ? (
                                    competencies.map((skill) => (
                                        <Chip key={skill.id} label={language === 'en' ? skill.nameEn : skill.nameEs} variant="outlined" sx={{ m: 0.5 }} />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {t('common.loading', "Loading...")}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                                {t('about.languages', "Languages")}
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                {spokenLanguages.length > 0 ? (
                                    spokenLanguages.map((lang) => (
                                        <Chip
                                            key={lang.id}
                                            label={`${language === 'en' ? lang.nameEn : lang.nameEs} (${language === 'en' ? lang.levelEn : lang.levelEs})`}
                                            color="default"
                                            variant="outlined"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        {t('common.loading', "Loading...")}
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutPage;
