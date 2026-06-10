import { apiClient } from '@/shared/api';
import type { Experience } from '@/entities/experience/model/types';

export const getAllExperiences = async (): Promise<Experience[]> => {
    const response = await apiClient.get<Experience[]>('/public/experiences');
    return response.data;
};

export const getExperiences = async (): Promise<Experience[]> => {
    const response = await apiClient.get<Experience[]>('/admin/experiences');
    return response.data;
};

export const createExperience = async (data: Omit<Experience, 'id'>): Promise<Experience> => {
    const response = await apiClient.post<Experience>('/admin/experiences', data);
    return response.data;
};

export const updateExperience = async (id: string, data: Partial<Experience>): Promise<Experience> => {
    const response = await apiClient.put<Experience>(`/admin/experiences/${id}`, data);
    return response.data;
};

export const deleteExperience = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/experiences/${id}`);
};
