import { apiClient } from '@/shared/api';
import type { Profile } from '@/entities/profile/model/types';

export const getProfile = async (): Promise<Profile> => {
    const response = await apiClient.get<Profile>('/public/profile');
    return response.data;
};

export const updateProfile = async (data: Partial<Profile>): Promise<Profile> => {
    const response = await apiClient.put<Profile>('/admin/profile', data);
    return response.data;
};
