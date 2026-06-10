import { useState, useEffect, useCallback, useRef } from 'react';
import { getProfile } from '@/entities/profile/api/profileApi';
import { requestCache } from '@/shared/lib/requestCache';
import { i18n } from '@/shared/config';
import type { Profile } from '@/entities/profile/model/types';

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
            const data = await getProfile();
            setProfile(data);
            fetchedRef.current = true;
        } catch (err) {
            setError('Failed to load profile');
            console.error('Failed to fetch profile:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
}
