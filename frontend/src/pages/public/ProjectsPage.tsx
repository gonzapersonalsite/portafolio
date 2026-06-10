import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { publicService } from '@/services/publicService';
import type { Project } from '@/types';
import ProjectCard from '@/components/portfolio/ProjectCard';
import { ProjectGridSkeleton, PageHeaderSkeleton } from '@/components/common/SkeletonLoaders';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import { requestCache } from '@/utils/requestCache';
import i18n from '@/config/i18n';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();
    
    // Intentar obtener de caché inmediatamente
    const cacheKey = `/public/projects?&lang=${i18n.language}`;
    const cachedProjects = requestCache.get<Project[]>(cacheKey);
    const hadCachedRef = React.useRef(!!cachedProjects);
    hadCachedRef.current = !!cachedProjects;
    
    const [projects, setProjects] = React.useState<Project[]>(cachedProjects || []);
    const [loading, setLoading] = React.useState(!cachedProjects);
    const [error, setError] = React.useState<string | null>(null);

    /* eslint-disable react-hooks/set-state-in-effect */
    React.useEffect(() => {
        let cancelled = false;
        const hadCache = hadCachedRef.current;

        (async () => {
            try {
                setError(null);
                if (!hadCache) setLoading(true);
                const data = await publicService.getAllProjects();
                if (!cancelled) {
                    setProjects(data);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Failed to fetch projects", err);
                    setError("Failed to load projects");
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [language]);
    /* eslint-enable react-hooks/set-state-in-effect */

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
                    <ErrorState message={error} onRetry={fetchProjects} />
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
