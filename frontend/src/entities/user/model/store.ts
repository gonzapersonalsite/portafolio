import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/entities/user/api/authApi';
import type { AuthResponse } from '@/entities/user/model/types';

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
                set({
                    token: data.token,
                    username: data.username,
                    isAuthenticated: true
                });
            },

            logout: () => {
                set({
                    token: null,
                    username: null,
                    isAuthenticated: false,
                });
            },

            validateToken: async () => {
                const { token } = get();
                if (!token) return false;

                try {
                    const isValid = await authApi.validateToken();
                    if (!isValid) {
                        get().logout();
                    }
                    return isValid;
                } catch {
                    get().logout();
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                username: state.username,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
