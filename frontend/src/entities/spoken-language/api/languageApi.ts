import { apiClient } from '@/shared/api';
import type { SpokenLanguage } from '@/entities/spoken-language/model/types';

export const getAllSpokenLanguages = async (): Promise<SpokenLanguage[]> => {
    const response = await apiClient.get<SpokenLanguage[]>('/public/spoken-languages');
    return response.data;
};

export const getSpokenLanguages = async (): Promise<SpokenLanguage[]> => {
    const response = await apiClient.get<SpokenLanguage[]>('/admin/spoken-languages');
    return response.data;
};

export const createSpokenLanguage = async (data: Omit<SpokenLanguage, 'id'>): Promise<SpokenLanguage> => {
    const response = await apiClient.post<SpokenLanguage>('/admin/spoken-languages', data);
    return response.data;
};

export const updateSpokenLanguage = async (id: string, data: Partial<SpokenLanguage>): Promise<SpokenLanguage> => {
    const response = await apiClient.put<SpokenLanguage>(`/admin/spoken-languages/${id}`, data);
    return response.data;
};

export const deleteSpokenLanguage = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/spoken-languages/${id}`);
};
