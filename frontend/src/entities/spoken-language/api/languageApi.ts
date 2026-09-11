import languagesData from './data.json';
import type { SpokenLanguage } from '@/entities/spoken-language/model/types';

export const getAllSpokenLanguages = (): SpokenLanguage[] => languagesData as SpokenLanguage[];
