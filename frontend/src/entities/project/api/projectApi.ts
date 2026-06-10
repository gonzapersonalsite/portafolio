import { apiClient } from '@/shared/api';
import type { Project } from '@/entities/project/model/types';

export const getAllProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/public/projects');
    return response.data;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/public/projects/featured');
    return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/admin/projects');
    return response.data;
};

export const createProject = async (data: Omit<Project, 'id'>): Promise<Project> => {
    const response = await apiClient.post<Project>('/admin/projects', data);
    return response.data;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put<Project>(`/admin/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/projects/${id}`);
};
