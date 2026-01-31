import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { publicService } from '@/services/publicService';
import type { Profile } from '@/types';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await publicService.getProfile();
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile in footer:", err);
            }
        };
        fetchProfile();
    }, []);

    const socialLinks = {
        github: profile?.githubUrl || "https://github.com/gonzapersonalsite",
        linkedin: profile?.linkedinUrl || "http://www.linkedin.com/in/gonzalo-martinez-garcia-353507370",
        email: `mailto:${profile?.email || "gonzalomartinezg2001@gmail.com"}`
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                borderTop: `1px solid ${theme.palette.divider}`
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" color="text.primary" fontWeight="bold">
                            {language === 'en' ? profile?.fullNameEn : profile?.fullNameEs}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Full Stack Developer
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            color="inherit"
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            color="inherit"
                        >
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton
                            href={socialLinks.email}
                            aria-label="Email"
                            color="inherit"
                        >
                            <EmailIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary" align="center">
                        © {currentYear} {language === 'en' ? profile?.fullNameEn : profile?.fullNameEs}. {t('footer.rights', 'All rights reserved.')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
