export interface Project {
    id: string;
    titleEn: string;
    titleEs: string;
    descriptionEn: string;
    descriptionEs: string;
    technologies: string[];
    imageUrls: string[];
    githubUrl?: string;
    liveUrl?: string;
    type: 'WEB' | 'DESKTOP' | 'MOBILE' | 'OTHER';
    featured: boolean;
    order: number;
}
