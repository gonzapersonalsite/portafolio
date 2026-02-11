import React from 'react';
import { Box, Container, Typography, Button, Grid, useTheme, Chip, Stack, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import { keyframes } from '@emotion/react';
import ProjectCard from '@/components/portfolio/ProjectCard';
import { publicService } from '@/services/publicService';
import { useLanguage } from '@/context/LanguageContext';
import { Link as RouterLink } from 'react-router-dom';
import { formatImageUrl } from '@/utils/imageUtils';
import { HeroSkeleton, ProjectCardSkeleton } from '@/components/common/SkeletonLoaders';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import EmptyState from '@/components/common/EmptyState';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import type { Profile as ProfileType, Project } from '@/types';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const [featuredProjects, setFeaturedProjects] = React.useState<Project[]>([]);
    const [profile, setProfile] = React.useState<ProfileType | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const [projectsData, profileData] = await Promise.all([
                    publicService.getFeaturedProjects(),
                    publicService.getProfile()
                ]);
                setFeaturedProjects(projectsData);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    // Helper to get localized text
    const getLocalizedText = (en: string, es: string) => {
        return language === 'en' ? (en || es) : (es || en);
    };

    if (loading) {
        return (
            <Box>
                <HeroSkeleton />
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <Skeleton width="300px" height={60} sx={{ mb: 6 }} />
                        <Grid container spacing={4}>
                            {Array.from(new Array(3)).map((_, i) => (
                                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
                                    <ProjectCardSkeleton />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
                <Box sx={{ py: 10 }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={6} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Skeleton animation="wave" variant="rectangular" width="80%" sx={{ pt: '100%', borderRadius: 4, mx: 'auto' }} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Skeleton animation="wave" width="100px" height={20} sx={{ mb: 2 }} />
                                <Skeleton animation="wave" width="80%" height={50} sx={{ mb: 3 }} />
                                <Skeleton animation="wave" width="100%" height={20} sx={{ mb: 1 }} />
                                <Skeleton animation="wave" width="100%" height={20} sx={{ mb: 1 }} />
                                <Skeleton animation="wave" width="90%" height={20} sx={{ mb: 4 }} />
                                <Skeleton animation="wave" width="150px" height={48} sx={{ borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
                    position: 'relative'
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography
                                variant="overline"
                                color="text.primary"
                                sx={{ letterSpacing: 2, fontWeight: 'bold' }}
                            >
                                {getLocalizedText(profile?.greetingEn || "", profile?.greetingEs || "")}
                            </Typography>
                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    background: theme.palette.mode === 'dark'
                                        ? `linear-gradient(45deg, #fff 30%, ${theme.palette.primary.main} 90%)`
                                        : `linear-gradient(45deg, ${theme.palette.text.primary} 30%, ${theme.palette.primary.main} 90%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {language === 'en' ? profile?.fullNameEn || t('home.name') : profile?.fullNameEs || t('home.name')}
                            </Typography>
                            <Typography variant="h4" component="p" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                                {getLocalizedText(profile?.subtitleEn || "", profile?.subtitleEs || "") || t('home.jobTitle')}
                            </Typography>
                            
                            <Box sx={{ maxWidth: 600, mb: 4 }}>
                                <RichTextRenderer 
                                    text={getLocalizedText(profile?.descriptionEn || "", profile?.descriptionEs || "") || t('home.description')}
                                />
                            </Box>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    component={RouterLink}
                                    to="/projects"
                                >
                                    {t('home.cta')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<DownloadIcon />}
                                    href={profile?.cvUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    disabled={!profile?.cvUrl}
                                >
                                    {t('home.resume')}
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Box
                                sx={{
                                    animation: `${float} 6s ease-in-out infinite`,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {/* Abstract Code Card Visualization */}
                                <Box sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    bgcolor: 'background.paper',
                                    boxShadow: theme.shadows[10],
                                    border: `1px solid ${theme.palette.divider}`,
                                    position: 'relative'
                                }}>
                                    <Stack spacing={2}>
                                        <Chip icon={<CodeIcon />} label={t('home.chips.frontend')} color="primary" variant="outlined" />
                                        <Chip icon={<StorageIcon />} label={t('home.chips.backend')} color="secondary" variant="outlined" />
                                        <Chip icon={<WebIcon />} label={t('home.chips.uiux')} color="success" variant="outlined" />
                                    </Stack>
                                    <Typography variant="caption" display="block" sx={{ mt: 2, fontFamily: 'monospace' }}>
                                        {t('home.chips.passion')}
                                    </Typography>
                                </Box>

                                {/* Decorative Circles */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: -40,
                                    right: -40,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    opacity: 0.2,
                                    zIndex: -1
                                }} />
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    left: -20,
                                    width: 150,
                                    height: 150,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.main',
                                    opacity: 0.1,
                                    zIndex: -1
                                }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>


            {/* Featured Projects Section */}
            <Box sx={{ py: 8, bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50' }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                        <Typography variant="h3" component="h2" fontWeight="800">
                            {t('projects.featured')}
                        </Typography>
                        <Button
                            endIcon={<ArrowForwardIcon />}
                            component={RouterLink}
                            to="/projects"
                            size="large"
                        >
                            {t('projects.viewAll')}
                        </Button>
                    </Box>
                    <Grid container spacing={4}>
                        {featuredProjects.map((project) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                                <ProjectCard project={project} />
                            </Grid>
                        ))}
                        {featuredProjects.length === 0 && (
                            <Grid size={{ xs: 12 }}>
                                <EmptyState
                                    title={t('admin.emptyState.featured.title', 'Highlights Coming Soon')}
                                    description={t('admin.emptyState.featured.description', 'Curating the best projects to showcase here.')}
                                    icon={<RocketLaunchIcon />}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>

            {/* About Preview Section */}
            <Container sx={{ py: 10 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ImageWithFallback
                            src={formatImageUrl(profile?.imageUrl)}
                            alt={(language === 'en' ? profile?.fullNameEn : profile?.fullNameEs) || 'Profile'}
                            loading="lazy"
                            sx={{
                                maxWidth: 400,
                                margin: '0 auto',
                                display: 'block',
                                borderRadius: 4,
                                boxShadow: theme.shadows[8],
                                transform: 'rotate(-2deg)',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'rotate(0deg)' }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={1.5}>
                            {t('about.subtitle', "WHO I AM")}
                        </Typography>
                        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                            {getLocalizedText(profile?.aboutTitleEn || "", profile?.aboutTitleEs || "") || t('about.title')}
                        </Typography>
                        <Box sx={{ mb: 3, '& p': { fontSize: '1.1rem' } }}>
                            <RichTextRenderer 
                                text={getLocalizedText(profile?.aboutSummaryEn || "", profile?.aboutSummaryEs || "") || t('about.summary')}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to="/about"
                        >
                            {t('about.more', "More About Me")}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
