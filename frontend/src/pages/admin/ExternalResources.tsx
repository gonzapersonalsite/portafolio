import React from 'react';
import {
    Box, Paper, Typography, Grid, Card, CardContent, CardActions, 
    Button, Chip, Divider, useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EmailIcon from '@mui/icons-material/Email';

const ExternalResources: React.FC = () => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isEnglish = i18n.language === 'en';

    const resources = [
        {
            title: 'PostImages',
            url: 'https://postimages.org/',
            icon: <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            description: isEnglish 
                ? 'Used to upload images and generate direct URLs for use in the portfolio (projects, skills, etc.).'
                : 'Utilizado para subir imágenes y generar URLs directas para su uso en el portafolio (proyectos, habilidades, etc.).',
            tags: ['Images', 'Hosting', 'CDN'],
            actionText: isEnglish ? 'Go to PostImages' : 'Ir a PostImages'
        },
        {
            title: 'EmailJS Dashboard',
            url: 'https://dashboard.emailjs.com/admin',
            icon: <EmailIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            description: isEnglish 
                ? 'Manages the contact form functionality. Used to view email logs, templates, and API keys.'
                : 'Gestiona la funcionalidad del formulario de contacto. Utilizado para ver registros de correos, plantillas y claves API.',
            tags: ['Email', 'Forms', 'Contact'],
            actionText: isEnglish ? 'Go to EmailJS' : 'Ir a EmailJS'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                    {t('admin.externalResources')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {isEnglish 
                        ? 'Quick access to external tools and services connected to this portfolio.' 
                        : 'Acceso rápido a herramientas y servicios externos conectados a este portafolio.'}
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
