import React from 'react';
import { Box, Container, Typography, Paper, Chip, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { publicService } from '@/services/publicService';
import type { Experience } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ExperienceSkeleton, PageHeaderSkeleton } from '@/components/common/SkeletonLoaders';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import ScrollableContent from '@/components/common/ScrollableContent';

const ExperiencePage: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const [experiences, setExperiences] = React.useState<Experience[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const data = await publicService.getAllExperiences();
                // Optionally sort by order if backend doesn't
                setExperiences(data);
            } catch (err) {
                console.error("Failed to fetch experiences", err);
                setError("Failed to load experiences");
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <PageHeaderSkeleton />
                    <ExperienceSkeleton />
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography color="error">{t('common.error')}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" fontWeight="bold">
                    {t('nav.experience', "EXPERIENCE")}
                </Typography>
                <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mb: 6 }}>
                    {t('experience.heading', "Work History")}
                </Typography>

                <Timeline
                    position="right"
                    sx={{
                        [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.3, // Adjust opposite content width to prevent date wrapping
                        },
                        p: 0
                    }}
                >
                    {experiences.map((exp, index) => (
                        <TimelineItem key={exp.id}>
                            <TimelineOppositeContent color="text.secondary" sx={{ py: '12px', px: 2, display: { xs: 'none', md: 'block' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                    <CalendarMonthIcon fontSize="small" />
                                    <Typography variant="body2" fontWeight="bold" sx={{ whiteSpace: 'nowrap' }}>
                                        {exp.startDate} — {exp.endDate || t('common.present', 'Present')}
                                    </Typography>
                                </Box>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineDot color={index === 0 ? "primary" : "grey"} variant={index === 0 ? "filled" : "outlined"}>
                                    <BusinessIcon />
                                </TimelineDot>
                                {index < experiences.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        mb: 4,
                                        width: '100%',
                                        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: theme.shadows[4]
                                        }
                                    }}
                                >
                                    {/* Mobile Date View */}
                                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                                        <CalendarMonthIcon fontSize="small" />
                                        <Typography variant="caption" fontWeight="bold">
                                            {exp.startDate} — {exp.endDate || t('common.present', 'Present')}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" component="h3" fontWeight="bold" color="primary">
                                        {language === 'en' ? exp.positionEn : exp.positionEs}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                                        @{language === 'en' ? exp.companyEn : exp.companyEs}
                                    </Typography>
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <ScrollableContent maxHeight="200px">
                                            <RichTextRenderer text={language === 'en' ? exp.descriptionEn : exp.descriptionEs} />
                                        </ScrollableContent>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                        {exp.technologies.map(tech => (
                                            <Chip key={tech} label={tech} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </Container>
        </Box>
    );
};

export default ExperiencePage;
