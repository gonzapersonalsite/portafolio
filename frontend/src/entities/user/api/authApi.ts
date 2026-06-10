import { apiClient } from '@/shared/api';
import type { AuthResponse } from '@/entities/user/model/types';
import type { ForgotPasswordRequest, MessageResponse, ResetPasswordRequest } from '@/shared/lib/types';

export interface LoginCredentials {
    username: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    validateToken: async (): Promise<boolean> => {
        const response = await apiClient.get<boolean>('/auth/validate');
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/auth/forgot-password', data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/auth/reset-password', data);
        return response.data;
    }
};
