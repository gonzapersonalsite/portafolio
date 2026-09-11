import skillsData from './data.json';
import type { Skill } from '@/entities/skill/model/types';

export const getAllSkills = (): Skill[] => skillsData as Skill[];
