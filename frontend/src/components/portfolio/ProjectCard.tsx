import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    CardActions
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import StarIcon from '@mui/icons-material/Star';
import type { Project } from '@/types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import ImageWithFallback from '@/components/common/ImageWithFallback';

import { formatImageUrl } from '@/utils/imageUtils';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const title = language === 'en' ? project.titleEn : project.titleEs;
    const description = language === 'en' ? project.descriptionEn : project.descriptionEs;
    const imageUrl = formatImageUrl(project.imageUrl);

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
            }
        }}>
            <ImageWithFallback
                src={imageUrl}
                alt={title}
                type="project"
                aspectRatio="16/9"
                sx={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.05)'
                }}
                // @ts-ignore
                referrerPolicy="no-referrer"
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 700, pr: 2 }}>
                        {title}
                    </Typography>
                    {project.featured && (
                        <StarIcon color="warning" sx={{ fontSize: '1.5rem', flexShrink: 0 }} />
                    )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{
                    mb: 3,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {description}
                </Typography>
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
                        {t('common.preview', 'Demo')}
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProjectCard;
