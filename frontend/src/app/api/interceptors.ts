import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import { i18n } from '@/shared/config';

let handlingUnauthorized = false;

export function setupInterceptors() {
    apiClient.interceptors.request.use(
        (config) => {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            config.headers['Accept-Language'] = i18n.language;
            return config;
        },
        (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const path = window.location.pathname || '';
                const onAdmin = path.startsWith('/admin');
                const isLogin = path === '/admin/login';
                if (onAdmin && !isLogin && !handlingUnauthorized) {
                    handlingUnauthorized = true;
                    try {
                        useAuthStore.getState().logout();
                    } finally {
                        window.location.replace('/admin/login');
                    }
                }
            }
            return Promise.reject(error);
        }
    );
}
