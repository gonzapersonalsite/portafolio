import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    CardActions,
    IconButton,
    Dialog
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { Project } from '@/types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ImageWithFallback from '@/components/common/ImageWithFallback';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import ScrollableContent from '@/components/common/ScrollableContent';

import { formatImageUrl } from '@/utils/imageUtils';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const title = language === 'en' ? project.titleEn : project.titleEs;
    const description = language === 'en' ? project.descriptionEn : project.descriptionEs;
    const imageUrls = Array.isArray(project.imageUrls) ? project.imageUrls : [];
    const coverImageUrl = imageUrls.length > 0 && imageUrls[0] ? formatImageUrl(imageUrls[0]) : '';

    const handleOpenGallery = () => {
        if (imageUrls.length > 0) {
            setCurrentImageIndex(0);
            setGalleryOpen(true);
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'WEB': return <LanguageIcon fontSize="small" />;
            case 'DESKTOP': return <DesktopWindowsIcon fontSize="small" />;
            case 'MOBILE': return <SmartphoneIcon fontSize="small" />;
            default: return <CodeIcon fontSize="small" />;
        }
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: (theme) => theme.palette.mode === 'light'
                    ? '0 12px 24px rgba(0,0,0,0.15)'
                    : '0 12px 24px rgba(0,0,0,0.4)'
            },
            '&:hover .preview-overlay': {
                opacity: 1
            }
        }}>
            <Box sx={{ position: 'relative' }}>
                <ImageWithFallback
                    src={coverImageUrl}
                    alt={title}
                    type="project"
                    aspectRatio="16/9"
                    sx={{
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.02)'
                        }
                    }}
                    referrerPolicy="no-referrer"
                />
                
                {imageUrls.length > 0 && (
                    <Box
                        className="preview-overlay"
                        onClick={handleOpenGallery}
                        sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            cursor: 'pointer',
                            zIndex: 1
                        }}
                    >
                        <IconButton
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                            }}
                            size="large"
                        >
                            <VisibilityIcon fontSize="large" />
                        </IconButton>
                    </Box>
                )}

                <Chip
                    label={t(`projects.types.${project.type || 'WEB'}`)}
                    icon={getTypeIcon(project.type || 'WEB')}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        fontWeight: 600,
                        boxShadow: 2,
                        '& .MuiChip-icon': {
                            color: 'primary.main'
                        },
                        '.MuiChip-label': {
                            px: 1
                        }
                    }}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, pr: 2 }}>
                        {title}
                    </Typography>
                    {project.featured && (
                        <StarIcon color="warning" sx={{ fontSize: '1.5rem', flexShrink: 0 }} />
                    )}
                </Box>
                <Box sx={{ mb: 3 }}>
                    <ScrollableContent maxHeight="150px">
                        <RichTextRenderer text={description} variant="body2" />
                    </ScrollableContent>
                </Box>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 'auto' }}>
                    {project.technologies.map((tech) => (
                        <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                                borderRadius: 1.5,
                                fontWeight: 500,
                                bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(144, 202, 249, 0.08)',
                                border: 'none'
                            }}
                        />
                    ))}
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 3, pt: 0, justifyContent: 'flex-start', gap: 1 }}>
                {project.githubUrl && (
                    <Button
                        size="small"
                        startIcon={<GitHubIcon />}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontWeight: 600 }}
                    >
                        Code
                    </Button>
                )}
                {project.liveUrl && (
                    <Button
                        size="small"
                        startIcon={<LaunchIcon />}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{ fontWeight: 600, px: 2 }}
                    >
                        {t('projects.viewLive')}
                    </Button>
                )}
            </CardActions>

            {/* Gallery Dialog (Escaparate Profesional) */}
            <Dialog 
                open={galleryOpen} 
                onClose={() => setGalleryOpen(false)}
                fullScreen
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)'
                    }
                }}
            >
                <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {/* Botón de Cerrar Fijo */}
                    <IconButton
                        onClick={() => setGalleryOpen(false)}
                        size="large"
                        sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            right: 16, 
                            color: 'white', 
                            zIndex: 1300,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                        }}
                    >
                        <CloseIcon fontSize="large" />
                    </IconButton>
                    
                    {/* Contenedor Principal de la Imagen (Fijo) */}
                    <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        position: 'relative',
                        px: { xs: 2, md: 8 },
                        py: 2
                    }}>
                        {imageUrls.length > 1 && (
                            <IconButton 
                                onClick={handlePrevImage}
                                size="large"
                                sx={{ 
                                    position: 'absolute', 
                                    left: { xs: 8, md: 24 }, 
                                    color: 'white', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, 
                                    zIndex: 10 
                                }}
                            >
                                <ArrowBackIosNewIcon fontSize="large" />
                            </IconButton>
                        )}
                        
                        <img 
                            src={formatImageUrl(imageUrls[currentImageIndex])} 
                            alt={`${title} - ${currentImageIndex + 1}`}
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '100%', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))'
                            }}
                        />
                        
                        {imageUrls.length > 1 && (
                            <IconButton 
                                onClick={handleNextImage}
                                size="large"
                                sx={{ 
                                    position: 'absolute', 
                                    right: { xs: 8, md: 24 }, 
                                    color: 'white', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }, 
                                    zIndex: 10 
                                }}
                            >
                                <ArrowForwardIosIcon fontSize="large" />
                            </IconButton>
                        )}
                    </Box>
                    
                    {/* Tira de Miniaturas Fija en la Base */}
                    {imageUrls.length > 1 && (
                        <Box sx={{ 
                            height: '100px', 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2, 
                            overflowX: 'auto', 
                            p: 2, 
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {imageUrls.map((url, idx) => (
                                <Box 
                                    key={idx} 
                                    onClick={() => setCurrentImageIndex(idx)}
                                    sx={{ 
                                        width: 80, 
                                        height: 56, 
                                        cursor: 'pointer',
                                        opacity: currentImageIndex === idx ? 1 : 0.4,
                                        border: currentImageIndex === idx ? '2px solid white' : '2px solid transparent',
                                        borderRadius: 1,
                                        transition: 'all 0.2s ease-in-out',
                                        backgroundImage: `url(${formatImageUrl(url)})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        flexShrink: 0,
                                        '&:hover': {
                                            opacity: 0.8,
                                            transform: 'scale(1.05)'
                                        }
                                    }} 
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Dialog>
        </Card>
    );
};

export default ProjectCard;
