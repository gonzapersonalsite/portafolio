import axios from 'axios';
import type { AxiosAdapter } from 'axios';
import { requestCache } from '@/utils/requestCache';
import { notificationEvents } from '@/utils/notificationEvents';
import i18n from '@/config/i18n';

const MAX_RETRIES = 2; // Reducido de 3 a 2 para evitar esperas eternas
const RETRY_DELAY = 1000;
const SLOW_CONNECTION_THRESHOLD = 3000; // Aumentado a 3s para evitar avisos falsos
const REQUEST_TIMEOUT = 60000; // Reducido a 60s (suficiente para cold start)

// Almacén para deduplicación de peticiones en vuelo
const pendingRequests = new Map<string, Promise<any>>();

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Custom adapter to handle caching, deduplication and retries
const cacheAdapter: AxiosAdapter = async (config) => {
    const { method, url, params, headers } = config;
    
    // 1. Verificar Caché (solo GET)
    const lang = headers?.['Accept-Language'] || i18n.language;
    const isGet = method?.toLowerCase() === 'get';
    const queryString = params ? JSON.stringify(params) : '';
    const cacheKey = `${url}?${queryString}&lang=${lang}`;

    if (isGet && url) {
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

        // 2. Deduplicación: Si ya hay una petición idéntica en curso, esperar a esa
        if (pendingRequests.has(cacheKey)) {
            try {
                const responseData = await pendingRequests.get(cacheKey);
                return {
                    data: responseData,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                    request: {}
                };
            } catch (error) {
                // Si la petición original falló, intentamos de nuevo aquí
            }
        }
    }

    // 3. Lógica de Petición Real con Reintentos
    const executeRequest = async (): Promise<any> => {
        let lastError;
        let slowConnectionTimer: any = null;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                if (attempt === 0 && !sessionStorage.getItem('cold_start_notified')) {
                    slowConnectionTimer = setTimeout(() => {
                        notificationEvents.emit('common.coldStartNotice', 'info');
                        sessionStorage.setItem('cold_start_notified', 'true');
                    }, SLOW_CONNECTION_THRESHOLD);
                }

                // Usamos una instancia limpia de axios para la petición real
                const response = await axios({
                    ...config,
                    adapter: undefined, // Forzar adaptador nativo
                    timeout: REQUEST_TIMEOUT
                });
                
                if (slowConnectionTimer) clearTimeout(slowConnectionTimer);

                // Guardar en Caché si es exitoso
                if (isGet && url) {
                    requestCache.set(cacheKey, response.data);
                } else if (!isGet && !url?.includes('/public/')) {
                    requestCache.clear();
                }
                
                return response;
            } catch (error: any) {
                if (slowConnectionTimer) clearTimeout(slowConnectionTimer);
                lastError = error;
                
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

    if (isGet && url) {
        // Envolver la ejecución en una promesa que guardamos en pendingRequests
        const requestPromise = executeRequest()
            .then(res => res.data)
            .finally(() => pendingRequests.delete(cacheKey));
        
        pendingRequests.set(cacheKey, requestPromise);
        
        const responseData = await requestPromise;
        return {
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
        };
    }

    return executeRequest();
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
