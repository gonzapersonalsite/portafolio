import projectsData from './data.json';
import type { Project } from '@/entities/project/model/types';

const projects = projectsData as Project[];

export const getAllProjects = (): Project[] => projects;

export const getFeaturedProjects = (): Project[] => projects.filter((p) => p.featured);
