import type { Project } from '../../src/entities/project/model/types.ts';
import type { Locale, RouteId } from './routes.ts';

export interface TwinLabels {
  technologies: string;
  pages: string;
  nav: Record<RouteId, string>;
  featuredProjects: string;
  viewLive: string;
  code: string;
  types: Record<Project['type'], string>;
  aboutCoreCompetencies: string;
  aboutLanguages: string;
  aboutSentenceTitle: string;
  downloadCv: string;
  skillsHeading: string;
  experienceHeading: string;
  present: string;
  projectsHeading: string;
  contactHeading: string;
  contactDescription: string;
  contactEmail: string;
  contactLocation: string;
  contactSocial: string;
}

// Labels that exist behind an i18n key mirror it exactly (a test enforces the
// parity); the rest are twin-specific wording with no UI counterpart.
export const TWIN_LABELS: Record<Locale, TwinLabels> = {
  en: {
    technologies: 'Technologies',
    pages: 'Pages',
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      contact: 'Contact',
    },
    featuredProjects: 'Featured Projects',
    viewLive: 'View Live',
    code: 'Code',
    types: {
      WEB: 'Web App',
      DESKTOP: 'Desktop App',
      MOBILE: 'Mobile App',
      OTHER: 'Other',
    },
    aboutCoreCompetencies: 'Core Competencies',
    aboutLanguages: 'Languages',
    aboutSentenceTitle: 'A sentence that defines me',
    downloadCv: 'Download CV',
    skillsHeading: 'Technical Expertise',
    experienceHeading: 'Work History',
    present: 'Present',
    projectsHeading: 'All Projects',
    contactHeading: 'Get In Touch',
    contactDescription:
      'I am open to new professional opportunities. If you have a project or a job offer, I would love to hear from you.',
    contactEmail: 'Email',
    contactLocation: 'Location',
    contactSocial: 'FOLLOW ME',
  },
  es: {
    technologies: 'Tecnologías',
    pages: 'Páginas',
    nav: {
      home: 'Inicio',
      about: 'Sobre Mí',
      skills: 'Habilidades',
      experience: 'Experiencia',
      projects: 'Proyectos',
      contact: 'Contacto',
    },
    featuredProjects: 'Proyectos Destacados',
    viewLive: 'Ver Demo',
    code: 'Code',
    types: {
      WEB: 'App Web',
      DESKTOP: 'App de Escritorio',
      MOBILE: 'App Móvil',
      OTHER: 'Otro',
    },
    aboutCoreCompetencies: 'Competencias Principales',
    aboutLanguages: 'Idiomas',
    aboutSentenceTitle: 'Una frase que me define',
    downloadCv: 'Descargar CV',
    skillsHeading: 'Experiencia Técnica',
    experienceHeading: 'Historial Laboral',
    present: 'Presente',
    projectsHeading: 'Todos los Proyectos',
    contactHeading: 'Contacto',
    contactDescription:
      'Estoy abierto a nuevas oportunidades profesionales. Si tienes un proyecto o una oferta de trabajo, me encantaría escucharte.',
    contactEmail: 'Correo',
    contactLocation: 'Ubicación',
    contactSocial: 'SÍGUEME',
  },
};
