import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import SkillsPage from '@/pages/public/SkillsPage';
import ExperiencePage from '@/pages/public/ExperiencePage';
import ProjectsPage from '@/pages/public/ProjectsPage';
import ContactPage from '@/pages/public/ContactPage';

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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="contact" element={<ContactPage />} />
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
