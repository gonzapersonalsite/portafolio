import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    
    return <>{children}</>;
};
