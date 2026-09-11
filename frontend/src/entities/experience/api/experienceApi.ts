import experiencesData from './data.json';
import type { Experience } from '@/entities/experience/model/types';

export const getAllExperiences = (): Experience[] => experiencesData as Experience[];
