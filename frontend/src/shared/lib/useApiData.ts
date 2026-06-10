import { useState, useEffect, useCallback, useRef } from 'react';
import { requestCache } from './requestCache';

export function useApiData<T>(
    fetcher: () => Promise<T>,
    cacheKey: string,
) {
    const cached = requestCache.get<T>(cacheKey);
    const [data, setData] = useState<T | null>(cached || null);
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(!!cached);
    const fetcherRef = useRef(fetcher);
    const cancelledRef = useRef(false);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const fetchData = useCallback(async () => {
        cancelledRef.current = false;
        try {
            setError(null);
            if (!fetchedRef.current) setLoading(true);
            const result = await fetcherRef.current();
            if (cancelledRef.current) return;
            setData(result);
            fetchedRef.current = true;
        } catch (err) {
            if (cancelledRef.current) return;
            setError('Failed to load data');
            console.error('Failed to fetch data:', err);
        } finally {
            if (!cancelledRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        return () => { cancelledRef.current = true; };
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
