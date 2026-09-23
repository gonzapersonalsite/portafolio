import skillsData from './data.json' with { type: 'json' };
import type { Skill } from '../model/types.ts';

export const getAllSkills = (): Skill[] => skillsData as Skill[];
