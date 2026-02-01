import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { AuthResponse, Profile } from '../types';
import { publicService } from '../services/publicService';

interface AuthState {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    profile: Profile | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
    validateToken: () => Promise<boolean>;
    fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            username: null,
            isAuthenticated: false,
            profile: null,

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
                    isAuthenticated: false,
                    profile: null
                });
            },

            validateToken: async () => {
                const { token } = get();
                if (!token) return false;

                try {
                    const isValid = await authService.validateToken();

                    if (!isValid) {
                        get().logout();
                    }

                    return isValid;
                } catch (error) {
                    get().logout();
                    return false;
                }
            },

            fetchProfile: async () => {
                const { profile } = get();
                if (profile) return; // Return cached profile if exists

                try {
                    const data = await publicService.getProfile();
                    set({ profile: data });
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                token: state.token, 
                username: state.username, 
                isAuthenticated: state.isAuthenticated,
                profile: state.profile 
            }),
        }
    )
);
