import apiClient from './apiClient';
import type { Skill, Experience, Project, SpokenLanguage, Profile } from '../types';

export const adminService = {
    // Skills
    getSkills: async () => {
        const response = await apiClient.get<Skill[]>('/admin/skills');
        return response.data;
    },
    createSkill: async (data: Omit<Skill, 'id'>) => {
        const response = await apiClient.post<Skill>('/admin/skills', data);
        return response.data;
    },
    updateSkill: async (id: string, data: Partial<Skill>) => {
        const response = await apiClient.put<Skill>(`/admin/skills/${id}`, data);
        return response.data;
    },
    deleteSkill: async (id: string) => {
        await apiClient.delete(`/admin/skills/${id}`);
    },

    // Experiences
    getExperiences: async () => {
        const response = await apiClient.get<Experience[]>('/admin/experiences');
        return response.data;
    },
    createExperience: async (data: Omit<Experience, 'id'>) => {
        const response = await apiClient.post<Experience>('/admin/experiences', data);
        return response.data;
    },
    updateExperience: async (id: string, data: Partial<Experience>) => {
        const response = await apiClient.put<Experience>(`/admin/experiences/${id}`, data);
        return response.data;
    },
    deleteExperience: async (id: string) => {
        await apiClient.delete(`/admin/experiences/${id}`);
    },

    // Projects
    getProjects: async () => {
        const response = await apiClient.get<Project[]>('/admin/projects');
        return response.data;
    },
    createProject: async (data: Omit<Project, 'id' | 'createdAt'>) => {
        const response = await apiClient.post<Project>('/admin/projects', data);
        return response.data;
    },
    updateProject: async (id: string, data: Partial<Project>) => {
        const response = await apiClient.put<Project>(`/admin/projects/${id}`, data);
        return response.data;
    },
    deleteProject: async (id: string) => {
        await apiClient.delete(`/admin/projects/${id}`);
    },

    // Profile
    getProfile: async () => {
        const response = await apiClient.get<Profile>('/admin/profile');
        return response.data;
    },
    updateProfile: async (data: Partial<Profile>) => {
        const response = await apiClient.put<Profile>('/admin/profile', data);
        return response.data;
    },

    // Spoken Languages
    getSpokenLanguages: async () => {
        const response = await apiClient.get<SpokenLanguage[]>('/admin/spoken-languages');
        return response.data;
    },
    createSpokenLanguage: async (data: Omit<SpokenLanguage, 'id'>) => {
        const response = await apiClient.post<SpokenLanguage>('/admin/spoken-languages', data);
        return response.data;
    },
    updateSpokenLanguage: async (id: string, data: Partial<SpokenLanguage>) => {
        const response = await apiClient.put<SpokenLanguage>(`/admin/spoken-languages/${id}`, data);
        return response.data;
    },
    deleteSpokenLanguage: async (id: string) => {
        await apiClient.delete(`/admin/spoken-languages/${id}`);
    },
};
