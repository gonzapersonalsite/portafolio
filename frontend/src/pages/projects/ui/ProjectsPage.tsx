import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllProjects, ProjectCard } from '@/entities/project';
import { EmptyState } from '@/shared/ui';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useContent, usePageMeta } from '@/shared/lib';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();

    usePageMeta({
        title: t('seo.projects.title'),
        description: t('seo.projects.description'),
    });

    const { data: projects } = useContent(() => getAllProjects());

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>
                    {t('nav.projects', "PORTFOLIO")}
                </Typography>
                <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 6, fontWeight: '800' }}>
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
                                title={t('emptyState.projects.title', 'Building the Future')}
                                description={t('emptyState.projects.description', 'No projects here yet, but great things are in the making.')}
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
