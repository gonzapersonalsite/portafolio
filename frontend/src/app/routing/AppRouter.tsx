import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { PublicLayout } from '@/app/layouts';
import {
    HeroSkeleton, PageHeaderSkeleton, SkillsSkeleton, ExperienceSkeleton,
    ProjectGridSkeleton, AboutSkeleton, ContactSkeleton
} from '@/shared/ui';

// Public Pages
const HomePage = React.lazy(() => import('@/pages/home'));
const AboutPage = React.lazy(() => import('@/pages/about'));
const SkillsPage = React.lazy(() => import('@/pages/skills'));
const ExperiencePage = React.lazy(() => import('@/pages/experience'));
const ProjectsPage = React.lazy(() => import('@/pages/projects'));
const ContactPage = React.lazy(() => import('@/pages/contact'));

// Warm the lazy page chunks while the browser is idle so navigation feels instant.
const pageLoaders = [
    () => import('@/pages/home'),
    () => import('@/pages/about'),
    () => import('@/pages/skills'),
    () => import('@/pages/experience'),
    () => import('@/pages/projects'),
    () => import('@/pages/contact'),
];

function usePrefetchPages() {
    useEffect(() => {
        let cancelled = false;
        const run = () => {
            if (!cancelled) {
                pageLoaders.forEach((load) => void load());
            }
        };

        if (typeof window.requestIdleCallback === 'function') {
            const id = window.requestIdleCallback(run, { timeout: 4000 });
            return () => {
                cancelled = true;
                window.cancelIdleCallback(id);
            };
        }

        const timer = window.setTimeout(run, 2000);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, []);
}

const PageLoader = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <PageHeaderSkeleton />
            {children}
        </Container>
    </Box>
);

export default function AppRouter() {
    usePrefetchPages();

    return (
        <Routes>
            <Route path="/" element={<PublicLayout />}>
                <Route index element={
                    <Suspense fallback={<HeroSkeleton />}><HomePage /></Suspense>
                } />
                <Route path="about" element={
                    <Suspense fallback={<PageLoader><AboutSkeleton /></PageLoader>}><AboutPage /></Suspense>
                } />
                <Route path="skills" element={
                    <Suspense fallback={<PageLoader><SkillsSkeleton /></PageLoader>}><SkillsPage /></Suspense>
                } />
                <Route path="experience" element={
                    <Suspense fallback={<PageLoader><ExperienceSkeleton /></PageLoader>}><ExperiencePage /></Suspense>
                } />
                <Route path="projects" element={
                    <Suspense fallback={<PageLoader><ProjectGridSkeleton /></PageLoader>}><ProjectsPage /></Suspense>
                } />
                <Route path="contact" element={
                    <Suspense fallback={<PageLoader><ContactSkeleton /></PageLoader>}><ContactPage /></Suspense>
                } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
