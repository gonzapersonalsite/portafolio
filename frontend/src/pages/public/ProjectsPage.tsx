import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { publicService } from '@/services/publicService';
import type { Project } from '@/types';
import ProjectCard from '@/components/portfolio/ProjectCard';
import { ProjectGridSkeleton, PageHeaderSkeleton } from '@/components/common/SkeletonLoaders';
import EmptyState from '@/components/common/EmptyState';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await publicService.getAllProjects();
                setProjects(data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
                setError("Failed to load projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <PageHeaderSkeleton />
                    <ProjectGridSkeleton />
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
                    {t('nav.projects', "PORTFOLIO")}
                </Typography>
                <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ mb: 6 }}>
                    {t('projects.heading', "All Projects")}
                </Typography>

                <Grid container spacing={4}>
                    {projects.map((project) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                            <ProjectCard project={project} />
                        </Grid>
                    ))}
                    {projects.length === 0 && (
                        <Grid size={{ xs: 12 }}>
                            <EmptyState
                                title={t('admin.emptyState.projects.title', 'Building the Future')}
                                description={t('admin.emptyState.projects.description', 'No projects here yet, but great things are in the making.')}
                                icon={<RocketLaunchIcon />}
                            />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default ProjectsPage;
