import axios from 'axios';
import type { AxiosAdapter } from 'axios';
import { requestCache } from '@/utils/requestCache';
import { notificationEvents } from '@/utils/notificationEvents';
import i18n from '@/config/i18n';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 120000, // Aumentado a 120 segundos para manejar el arranque en frío de Render
    headers: {
        'Content-Type': 'application/json',
    },
});

// Configuración de reintentos
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo base
const SLOW_CONNECTION_THRESHOLD = 2000; // 2 segundos

// Custom adapter to handle caching and retries
const cacheAdapter: AxiosAdapter = async (config) => {
    const { method, url, params } = config;
    
    // 1. Verificar Caché (solo GET)
    if (method?.toLowerCase() === 'get' && url) {
        const queryString = params ? JSON.stringify(params) : '';
        const cacheKey = `${url}?${queryString}`;
        const cachedData = requestCache.get(cacheKey);
        
        if (cachedData) {
            return {
                data: cachedData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
                request: {}
            };
        }
    }

    const { adapter, ...restConfig } = config;
    let lastError;
    let slowConnectionTimer: any = null;

    // 2. Lógica de Reintentos con Exponecial Backoff
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (attempt > 0) {
                const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            // Iniciar timer para detectar lentitud real solo en el primer intento y si no ha sido notificado
            if (attempt === 0 && !sessionStorage.getItem('cold_start_notified')) {
                slowConnectionTimer = setTimeout(() => {
                    notificationEvents.emit('common.coldStartNotice', 'info');
                    sessionStorage.setItem('cold_start_notified', 'true');
                }, SLOW_CONNECTION_THRESHOLD);
            }

            const response = await axios.request(restConfig);
            
            // Limpiar timer si la respuesta llega antes del umbral
            if (slowConnectionTimer) {
                clearTimeout(slowConnectionTimer);
                slowConnectionTimer = null;
            }

            // 3. Guardar en Caché si es exitoso
            if (method?.toLowerCase() === 'get' && url) {
                const queryString = params ? JSON.stringify(params) : '';
                const cacheKey = `${url}?${queryString}`;
                requestCache.set(cacheKey, response.data);
            } else if (method?.toLowerCase() !== 'get') {
                requestCache.clear();
            }
            
            return response;
        } catch (error: any) {
            // Limpiar timer en caso de error también
            if (slowConnectionTimer) {
                clearTimeout(slowConnectionTimer);
                slowConnectionTimer = null;
            }

            lastError = error;
            
            // Solo reintentar si es un error de red o un timeout
            // No reintentar en 4xx (excepto tal vez 429) o 5xx que no sean temporales
            const isNetworkError = !error.response;
            const isTimeout = error.code === 'ECONNABORTED';
            const isRetryableStatus = error.response && [502, 503, 504].includes(error.response.status);

            if (!(isNetworkError || isTimeout || isRetryableStatus) || attempt === MAX_RETRIES) {
                throw error;
            }
        }
    }

    throw lastError;
};

// Apply the custom adapter
apiClient.defaults.adapter = cacheAdapter;

// Add a request interceptor to include the JWT token and language if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add Accept-Language header based on current i18n language
        config.headers['Accept-Language'] = i18n.language;
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If unauthorized, maybe redirect to login or clear token?
            // For now, just let the component handle it or clear if needed
            // localStorage.removeItem('token'); 
        }
        return Promise.reject(error);
    }
);

export default apiClient;
