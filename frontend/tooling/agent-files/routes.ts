export const BASE_URL = 'https://mi-portafolio-gonzalo.vercel.app';

export type Locale = 'en' | 'es';

export type RouteId = 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

export interface RouteSpec {
  id: RouteId;
  path: string;
  shellTitle: string;
  shellDescription: string;
}

// The shell metadata mirrors what each page applies at runtime through
// usePageMeta (seo.<route> in shared/config/i18n.ts); a test keeps them in sync.
export const ROUTES: readonly RouteSpec[] = [
  {
    id: 'home',
    path: '/',
    shellTitle: 'Gonzalo Martinez | Full Stack Developer & Web App Specialist',
    shellDescription:
      'Portfolio of Gonzalo Martinez, a Full Stack Developer specialized in React, Java Spring Boot and modern web architectures. Based in Palma de Mallorca, Spain.',
  },
  {
    id: 'about',
    path: '/about',
    shellTitle: 'About Me | Gonzalo Martinez',
    shellDescription:
      'Learn about Gonzalo Martinez, a Full Stack Developer based in Palma de Mallorca, Spain. Discover my journey, philosophy, skills and professional background.',
  },
  {
    id: 'skills',
    path: '/skills',
    shellTitle: 'Skills | Gonzalo Martinez',
    shellDescription:
      'Explore the technical skills of Gonzalo Martinez, a Full Stack Developer proficient in React, TypeScript, Java, Spring Boot and modern web technologies.',
  },
  {
    id: 'experience',
    path: '/experience',
    shellTitle: 'Experience | Gonzalo Martinez',
    shellDescription:
      'View the professional experience of Gonzalo Martinez, a Full Stack Developer with expertise in web application development and modern architectures.',
  },
  {
    id: 'projects',
    path: '/projects',
    shellTitle: 'Projects | Gonzalo Martinez',
    shellDescription:
      'Browse portfolio projects by Gonzalo Martinez, showcasing web applications built with React, TypeScript, Java and modern development stacks.',
  },
  {
    id: 'contact',
    path: '/contact',
    shellTitle: 'Contact | Gonzalo Martinez',
    shellDescription:
      'Get in touch with Gonzalo Martinez for professional opportunities, collaborations, or project inquiries. Based in Palma de Mallorca, Spain.',
  },
];

export const absoluteUrl = (path: string): string => `${BASE_URL}${path}`;

export const HOME_ROUTE: RouteSpec = ROUTES[0];

const directoryOf = (route: RouteSpec): string => (route.path === '/' ? '' : route.path.slice(1));

export const htmlFileOf = (route: RouteSpec): string => {
  const directory = directoryOf(route);
  return directory === '' ? 'index.html' : `${directory}/index.html`;
};

export const twinPathOf = (route: RouteSpec, locale: Locale): string => {
  const directory = directoryOf(route);
  const prefix = directory === '' ? '' : `${directory}/`;
  return `/${prefix}index${locale === 'es' ? '.es' : ''}.md`;
};
