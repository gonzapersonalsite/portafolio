import { useState, useEffect, useCallback, useRef } from 'react';
import { publicService } from '@/services/publicService';
import { requestCache } from '@/utils/requestCache';
import i18n from '@/config/i18n';
import type { Profile } from '@/types';

export function useProfile() {
    const cacheKey = `/public/profile?&lang=${i18n.language}`;
    const cached = requestCache.get<Profile>(cacheKey);
    const [profile, setProfile] = useState<Profile | null>(cached || null);
    const [loading, setLoading] = useState(!cached);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(!!cached);

    const fetchProfile = useCallback(async () => {
        try {
            setError(null);
            if (!fetchedRef.current) setLoading(true);
            const data = await publicService.getProfile();
            setProfile(data);
            fetchedRef.current = true;
        } catch (err) {
            setError('Failed to load profile');
            console.error('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // fetchProfile is async — setState occurs after await, not synchronously
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
}
