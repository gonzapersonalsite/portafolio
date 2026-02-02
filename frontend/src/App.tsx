import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import {
  HeroSkeleton,
  PageHeaderSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
  ProjectGridSkeleton,
  AboutSkeleton,
  ContactSkeleton
} from '@/components/common/SkeletonLoaders';

// Public Pages
const HomePage = React.lazy(() => import('@/pages/public/HomePage'));
const AboutPage = React.lazy(() => import('@/pages/public/AboutPage'));
const SkillsPage = React.lazy(() => import('@/pages/public/SkillsPage'));
const ExperiencePage = React.lazy(() => import('@/pages/public/ExperiencePage'));
const ProjectsPage = React.lazy(() => import('@/pages/public/ProjectsPage'));
const ContactPage = React.lazy(() => import('@/pages/public/ContactPage'));

// Admin Pages
const LoginPage = React.lazy(() => import('@/pages/admin/LoginPage'));
const DashboardLayout = React.lazy(() => import('@/components/admin/DashboardLayout'));
import PublicLayout from '@/components/layout/PublicLayout';
const SkillsManagement = React.lazy(() => import('@/pages/admin/SkillsManagement'));
const ExperiencesManagement = React.lazy(() => import('@/pages/admin/ExperiencesManagement'));
const ProjectsManagement = React.lazy(() => import('@/pages/admin/ProjectsManagement'));
const ProfileManagement = React.lazy(() => import('@/pages/admin/ProfileManagement'));
const SpokenLanguageManagement = React.lazy(() => import('@/pages/admin/SpokenLanguageManagement'));
const ExternalResources = React.lazy(() => import('@/pages/admin/ExternalResources'));

import { useAuthStore } from '@/context/AuthStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={
          <Suspense fallback={<HeroSkeleton />}>
            <HomePage />
          </Suspense>
        } />
        <Route path="about" element={
          <Suspense fallback={<PageLoader><AboutSkeleton /></PageLoader>}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="skills" element={
          <Suspense fallback={<PageLoader><SkillsSkeleton /></PageLoader>}>
            <SkillsPage />
          </Suspense>
        } />
        <Route path="experience" element={
          <Suspense fallback={<PageLoader><ExperienceSkeleton /></PageLoader>}>
            <ExperiencePage />
          </Suspense>
        } />
        <Route path="projects" element={
          <Suspense fallback={<PageLoader><ProjectGridSkeleton /></PageLoader>}>
            <ProjectsPage />
          </Suspense>
        } />
        <Route path="contact" element={
          <Suspense fallback={<PageLoader><ContactSkeleton /></PageLoader>}>
            <ContactPage />
          </Suspense>
        } />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={
        <Suspense fallback={<LoadingFallback />}>
          <LoginPage />
        </Suspense>
      } />

      <Route path="/admin" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingFallback />}>
            <DashboardLayout />
          </Suspense>
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

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
