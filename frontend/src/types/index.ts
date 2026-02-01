export interface User {
    username: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    expiresAt: string;
}

export interface Skill {
    id: string;
    nameEn: string;
    nameEs: string;
    level: number;
    category: string;
    iconUrl?: string;
    order: number;
}

export interface Experience {
    id: string;
    companyEn: string;
    companyEs: string;
    positionEn: string;
    positionEs: string;
    startDate: string;
    endDate?: string;
    descriptionEn: string;
    descriptionEs: string;
    technologies: string[];
    order: number;
}

export interface Project {
    id: string;
    titleEn: string;
    titleEs: string;
    descriptionEn: string;
    descriptionEs: string;
    technologies: string[];
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    order: number;
}

export interface SpokenLanguage {
    id: string;
    nameEn: string;
    nameEs: string;
    levelEn: string;
    levelEs: string;
    proficiency: number;
    order: number;
}

export interface Profile {
    id: string;
    // Home
    greetingEn: string;
    greetingEs: string;
    titleEn: string;
    titleEs: string;
    subtitleEn: string;
    subtitleEs: string;
    descriptionEn: string;
    descriptionEs: string;
    // About
    aboutTitleEn: string;
    aboutTitleEs: string;
    aboutIntroTitleEn: string;
    aboutIntroTitleEs: string;
    aboutSummaryEn: string;
    aboutSummaryEs: string;
    aboutPhilosophyEn: string;
    aboutPhilosophyEs: string;
    sentenceEn: string;
    sentenceEs: string;
    // General
    cvUrl: string;
    fullNameEn: string;
    fullNameEs: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    locationEn: string;
    locationEs: string;
    logoText: string;
    imageUrl: string;
}

export interface LoginResponse {
    token: string;
    username: string;
    role: string;
}

export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
}
