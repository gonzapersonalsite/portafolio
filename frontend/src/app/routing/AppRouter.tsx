import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import { ProtectedRoute } from '@/features/auth';
import { PublicLayout } from '@/app/layouts';
import { DashboardLayout } from '@/widgets/dashboard-layout';
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

// Admin Auth Pages
const LoginPage = React.lazy(() => import('@/pages/admin/login'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/admin/forgot-password'));
const ResetPasswordPage = React.lazy(() => import('@/pages/admin/reset-password'));

// Admin Pages
const SkillsManagement = React.lazy(() => import('@/pages/admin/skills'));
const ExperiencesManagement = React.lazy(() => import('@/pages/admin/experiences'));
const ProjectsManagement = React.lazy(() => import('@/pages/admin/projects'));
const ProfileManagement = React.lazy(() => import('@/pages/admin/profile'));
const SpokenLanguageManagement = React.lazy(() => import('@/pages/admin/languages'));
const ExternalResources = React.lazy(() => import('@/pages/admin/external-resources'));

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
);

const PageLoader = ({ children }: { children: React.ReactNode }) => (
    <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
            <PageHeaderSkeleton />
            {children}
        </Container>
    </Box>
);

export default function AppRouter() {
    return (
        <Routes>
                {/* Public Routes */}
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

                {/* Admin Auth Routes */}
                <Route path="/admin/login" element={
                    <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense>
                } />
                <Route path="/admin/forgot-password" element={
                    <Suspense fallback={<LoadingFallback />}><ForgotPasswordPage /></Suspense>
                } />
                <Route path="/admin/reset-password" element={
                    <Suspense fallback={<LoadingFallback />}><ResetPasswordPage /></Suspense>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}><DashboardLayout /></Suspense>
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/admin/skills" replace />} />
                    <Route path="skills" element={<SkillsManagement />} />
                    <Route path="experiences" element={<ExperiencesManagement />} />
                    <Route path="projects" element={<ProjectsManagement />} />
                    <Route path="profile" element={<ProfileManagement />} />
                    <Route path="languages" element={<SpokenLanguageManagement />} />
                    <Route path="external-resources" element={<ExternalResources />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
    );
}
