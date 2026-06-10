import React, { useCallback } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getAllProjects, ProjectCard } from '@/entities/project';
import type { Project } from '@/entities/project';
import { ProjectGridSkeleton, PageHeaderSkeleton, EmptyState, ErrorState } from '@/shared/ui';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useLanguage } from '@/features/language-switch';
import { requestCache } from '@/shared/lib';
import { i18n } from '@/shared/config';

const ProjectsPage: React.FC = () => {
    const { t } = useTranslation();
    const { language } = useLanguage();

    // Intentar obtener de caché inmediatamente
    const cacheKey = `/public/projects?&lang=${i18n.language}`;
    const cachedProjects = requestCache.get<Project[]>(cacheKey);
    const fetchedRef = React.useRef(!!cachedProjects);
    
    const [projects, setProjects] = React.useState<Project[]>(cachedProjects || []);
    const [loading, setLoading] = React.useState(!cachedProjects);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        const hadCache = fetchedRef.current;

        (async () => {
            try {
                setError(null);
                if (!hadCache) setLoading(true);
                const data = await getAllProjects();
                if (!cancelled) {
                    setProjects(data);
                    setLoading(false);
                    fetchedRef.current = true;
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

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllProjects();
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch projects", err);
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
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
