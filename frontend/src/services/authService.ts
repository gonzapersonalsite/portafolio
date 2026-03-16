import apiClient from './apiClient';
import type { AuthResponse } from '../types';

export interface LoginCredentials {
    username: string;
    password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    validateToken: async (): Promise<boolean> => {
        const response = await apiClient.get<boolean>('/auth/validate');
        return response.data;
    }
};
