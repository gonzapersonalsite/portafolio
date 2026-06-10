import axios from 'axios';
import type { AxiosAdapter, AxiosResponse } from 'axios';
import { requestCache } from '@/shared/lib/requestCache';
import { notificationEvents } from '@/shared/lib/notificationEvents';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const SLOW_CONNECTION_THRESHOLD = 3000;
const REQUEST_TIMEOUT = 60000;

const pendingRequests = new Map<string, Promise<unknown>>();

export const apiClient = axios.create({
    baseURL: '/api',
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

const cacheAdapter: AxiosAdapter = async (config) => {
    const { method, url, params, headers } = config;
    
    const lang = headers?.['Accept-Language'] || 'en';
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
            } catch {
                // Original request failed, retry here
            }
        }
    }

    const executeRequest = async (): Promise<AxiosResponse<unknown>> => {
        let lastError: unknown;
        let slowConnectionTimer: number | null = null;

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

                const response = await axios({
                    ...config,
                    adapter: undefined,
                    timeout: REQUEST_TIMEOUT
                });
                
                if (slowConnectionTimer) clearTimeout(slowConnectionTimer);

                if (isGet && url) {
                    requestCache.set(cacheKey, response.data);
                } else if (!isGet && !url?.includes('/public/')) {
                    requestCache.clear();
                }
                
                return response;
            } catch (error: unknown) {
                if (slowConnectionTimer) clearTimeout(slowConnectionTimer);
                lastError = error;
                
                const isAxios = axios.isAxiosError(error);
                const isNetworkError = isAxios && !error.response;
                const isTimeout = isAxios && error.code === 'ECONNABORTED';
                const isRetryableStatus = isAxios && error.response && [502, 503, 504].includes(error.response.status);

                if (!(isNetworkError || isTimeout || isRetryableStatus) || attempt === MAX_RETRIES) {
                    throw error;
                }
            }
        }
        throw lastError;
    };

    if (isGet && url) {
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

apiClient.defaults.adapter = cacheAdapter;
