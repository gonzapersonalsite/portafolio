import profileData from './data.json';
import type { Profile } from '@/entities/profile/model/types';

export const getProfile = (): Profile => profileData as Profile;
