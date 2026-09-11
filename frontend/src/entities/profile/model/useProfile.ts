import { getProfile } from '@/entities/profile/api/profileApi';
import type { Profile } from '@/entities/profile/model/types';

export function useProfile() {
    const profile: Profile = getProfile();
    return { profile };
}
