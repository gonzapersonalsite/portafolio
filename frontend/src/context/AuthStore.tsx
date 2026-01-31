import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/apiClient';
import type { AuthResponse } from '../types';

interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    login: (data: AuthResponse) => void;
    logout: () => void;
    validateToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            username: null,
            isAuthenticated: false,

            login: (data: AuthResponse) => {
                localStorage.setItem('token', data.token);
                set({
                    token: data.token,
                    username: data.username,
                    isAuthenticated: true
                });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    token: null,
                    username: null,
                    isAuthenticated: false
                });
            },

            validateToken: async () => {
                const { token } = get();
                if (!token) return false;

                try {
                    const response = await apiClient.get<boolean>('/auth/validate');
                    const isValid = response.data;

                    if (!isValid) {
                        get().logout();
                    }

                    return isValid;
                } catch (error) {
                    get().logout();
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, username: state.username, isAuthenticated: state.isAuthenticated }),
        }
    )
);
