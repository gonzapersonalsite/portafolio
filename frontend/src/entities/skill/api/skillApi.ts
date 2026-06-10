import { apiClient } from '@/shared/api';
import type { Skill } from '@/entities/skill/model/types';

export const getAllSkills = async (): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>('/public/skills');
    return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
    const response = await apiClient.get<Skill[]>('/admin/skills');
    return response.data;
};

export const createSkill = async (data: Omit<Skill, 'id'>): Promise<Skill> => {
    const response = await apiClient.post<Skill>('/admin/skills', data);
    return response.data;
};

export const updateSkill = async (id: string, data: Partial<Skill>): Promise<Skill> => {
    const response = await apiClient.put<Skill>(`/admin/skills/${id}`, data);
    return response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/skills/${id}`);
};
