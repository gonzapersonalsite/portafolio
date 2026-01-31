import React from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, CardActions, 
    Button, Chip, Divider, useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EmailIcon from '@mui/icons-material/Email';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const ExternalResources: React.FC = () => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isEnglish = i18n.language === 'en';

    const resources = [
        {
            title: 'PostImages',
            url: 'https://postimages.org/',
            icon: <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: t('admin.resources.postImages.description'),
            tags: ['Images', 'Hosting', 'CDN'],
            actionText: t('admin.resources.postImages.action')
        },
        {
            title: 'EmailJS Dashboard',
            url: 'https://dashboard.emailjs.com/admin',
            icon: <EmailIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            description: t('admin.resources.emailJs.description'),
            tags: ['Email', 'Forms', 'Contact'],
            actionText: t('admin.resources.emailJs.action')
        },
        {
            title: 'Vercel Dashboard',
            url: 'https://vercel.com/gonzapersonalsites-projects/portafolio',
            icon: <RocketLaunchIcon sx={{ fontSize: 40, color: 'text.primary' }} />,
            description: t('admin.resources.vercel.description'),
            tags: ['Deployment', 'Hosting', 'Frontend'],
            actionText: t('admin.resources.vercel.action')
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                    {t('admin.externalResources')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('admin.externalResourcesDescription')}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {resources.map((resource) => (
                    <Grid size={{ xs: 12, md: 6 }} key={resource.title}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ mr: 2 }}>
                                        {resource.icon}
                                    </Box>
                                    <Typography variant="h5" component="div" fontWeight="bold">
                                        {resource.title}
                                    </Typography>
                                </Box>
                                
                                <Divider sx={{ mb: 2 }} />
                                
                                <Typography variant="body1" paragraph>
                                    {resource.description}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                    {resource.tags.map(tag => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    variant="contained" 
                                    endIcon={<LaunchIcon />} 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    fullWidth
                                >
                                    {resource.actionText}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ExternalResources;
