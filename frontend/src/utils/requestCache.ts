interface CacheItem<T = any> {
    data: T;
    timestamp: number;
}

const CACHE_PREFIX = 'api_cache_';
// 7 days in milliseconds (7 * 24 * 60 * 60 * 1000)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

export const requestCache = {
    get: <T>(key: string): T | null => {
        const itemStr = localStorage.getItem(CACHE_PREFIX + key);
        if (!itemStr) return null;

        try {
            const item: CacheItem<T> = JSON.parse(itemStr);
            const now = Date.now();

            if (now - item.timestamp > CACHE_DURATION) {
                localStorage.removeItem(CACHE_PREFIX + key);
                return null;
            }

            return item.data;
        } catch (e) {
            console.error('Error parsing cache item', e);
            return null;
        }
    },

    set: <T>(key: string, data: T): void => {
        try {
            const item: CacheItem<T> = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
        } catch (e) {
            console.warn('Failed to save to cache (quota might be full)', e);
            // Optional: Strategy to clear old cache if full
            requestCache.prune();
        }
    },

    clear: (): void => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    },

    remove: (key: string): void => {
        localStorage.removeItem(CACHE_PREFIX + key);
    },
    
    // Helper to remove expired items only
    prune: (): void => {
        const now = Date.now();
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                try {
                    const itemStr = localStorage.getItem(key);
                    if (itemStr) {
                        const item: CacheItem = JSON.parse(itemStr);
                        if (now - item.timestamp > CACHE_DURATION) {
                            localStorage.removeItem(key);
                        }
                    }
                } catch {
                    localStorage.removeItem(key);
                }
            }
        });
    }
};
