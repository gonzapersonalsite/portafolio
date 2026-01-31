import apiClient from './apiClient';
import type { Project, Skill, Experience, SpokenLanguage, Profile } from '../types';

export const publicService = {
    getAllSkills: async (): Promise<Skill[]> => {
        const response = await apiClient.get<Skill[]>('/public/skills');
        return response.data;
    },

    getAllExperiences: async (): Promise<Experience[]> => {
        const response = await apiClient.get<Experience[]>('/public/experiences');
        return response.data;
    },

    getAllProjects: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/public/projects');
        return response.data;
    },

    getAllSpokenLanguages: async (): Promise<SpokenLanguage[]> => {
        const response = await apiClient.get<SpokenLanguage[]>('/public/spoken-languages');
        return response.data;
    },

    getProfile: async (): Promise<Profile> => {
        const response = await apiClient.get<Profile>('/public/profile');
        return response.data;
    },

    getFeaturedProjects: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/public/projects/featured');
        return response.data;
    }
};
