import React from 'react';
import { Box, Container, Typography, Grid, Paper, IconButton, Stack, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ContactForm } from '@/features/contact-form';
import { useNotification } from '@/features/notifications';
import { useLanguage } from '@/features/language-switch';
import { getProfile } from '@/entities/profile';
import { useContent, usePageMeta } from '@/shared/lib';

const ContactPage: React.FC = () => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const theme = useTheme();
    const { showNotification } = useNotification();
    const { data: profile } = useContent(() => getProfile());

    usePageMeta({
        title: t('seo.contact.title'),
        description: t('seo.contact.description'),
    });

    const socialLinks = [
        { icon: <GitHubIcon fontSize="large" />, url: profile.githubUrl, label: 'GitHub' },
        { icon: <LinkedInIcon fontSize="large" />, url: profile.linkedinUrl, label: 'LinkedIn' }
    ];

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
                    {t('nav.contact', "CONTACT")}
                </Typography>
                <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 6, fontWeight: 800 }}>
                    {t('contact.heading', "Get In Touch")}
                </Typography>

                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                {t('contact.subtitle', "Let's work together")}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                                {t('contact.description', "I am open to new professional opportunities. If you have a project or a job offer, I would love to hear from you.")}
                            </Typography>

                            <Stack spacing={3} sx={{ mb: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }}>
                                        <EmailIcon />
                                    </Paper>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {t('contact.email', "Email")}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {profile.email}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'primary.main', color: 'white' }}>
                                        <LocationOnIcon />
                                    </Paper>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            {t('contact.location', "Location")}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {language === 'en' ? profile?.locationEn : profile?.locationEs}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>

                            <Box>
                                <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                                    {t('contact.social', "FOLLOW ME")}
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {socialLinks.map((link) => (
                                        <IconButton
                                            key={link.label}
                                            component="a"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={link.label}
                                            sx={{
                                                border: `1px solid ${theme.palette.divider}`,
                                                '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                                            }}
                                        >
                                            {link.icon}
                                        </IconButton>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 5 },
                                borderRadius: 4,
                                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <ContactForm onShowNotification={showNotification} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ContactPage;
