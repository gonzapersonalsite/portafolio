import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllProjects, ProjectCard } from '@/entities/project';
import { ProjectGridSkeleton, PageHeaderSkeleton, EmptyState, ErrorState } from '@/shared/ui';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useApiData } from '@/shared/lib';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();

    const { data: projects, loading, error, refetch } = useApiData(
        () => getAllProjects(),
        '/public/projects'
    );

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
            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <ErrorState message={error} onRetry={refetch} />
                </Container>
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
                    {(projects ?? []).map((project) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                            <ProjectCard project={project} />
                        </Grid>
                    ))}
                    {(projects ?? []).length === 0 && (
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
