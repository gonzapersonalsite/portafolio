import axios from 'axios';
import type { AxiosAdapter } from 'axios';
import { requestCache } from '@/utils/requestCache';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Custom adapter to handle caching
const cacheAdapter: AxiosAdapter = async (config) => {
    const { method, url, params } = config;
    
    // Only cache GET requests
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

    // Remove the adapter from the config to use the default axios behavior
    // This prevents infinite recursion
    const { adapter, ...restConfig } = config;
    
    try {
        // Use the global axios instance to perform the request with the default adapter
        const response = await axios.request(restConfig);
        
        // Handle caching for successful responses
        if (method?.toLowerCase() === 'get' && url) {
            const queryString = params ? JSON.stringify(params) : '';
            const cacheKey = `${url}?${queryString}`;
            requestCache.set(cacheKey, response.data);
        } else if (method?.toLowerCase() !== 'get') {
            // Invalidate cache on mutations (POST, PUT, DELETE)
            requestCache.clear();
        }
        
        return response;
    } catch (error) {
        throw error;
    }
};

// Apply the custom adapter
apiClient.defaults.adapter = cacheAdapter;

// Add a request interceptor to include the JWT token if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
