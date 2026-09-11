import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            nav: {
                home: 'Home',
                about: 'About',
                skills: 'Skills',
                experience: 'Experience',
                projects: 'Projects',
                contact: 'Contact',
            },
            home: {
                cta: 'View Projects',
                resume: 'Download CV',
                name: 'Gonzalo Martinez',
                jobTitle: 'Junior Full Stack Developer',
                description: 'Junior Full Stack Developer. I learn fast, adapt to new technologies, and enjoy creating useful and maintainable web solutions.',
                chips: {
                    frontend: 'Frontend Developer',
                    backend: 'Backend Architect',
                    uiux: 'UI/UX Enthusiast',
                    passion: '<Code /> with passion'
                }
            },
            about: {
                subtitle: 'WHO I AM',
                jobTitle: 'Junior Full Stack Developer',
                summary: 'My journey began with a strong interest in understanding how systems work, which led me to complete a degree in Microcomputer Systems and Networks. Later, I specialized in Web Application Development and discovered that what I enjoy most is building complete applications, from front-end to back-end.\n\nToday I am looking for my first opportunity as a junior Full Stack developer, open to learning new technologies, contributing value to the team, and growing step by step, whether in frontend, backend, or full stack roles.',
                title: 'Junior Full Stack Developer',
                philosophy: 'I like to write clear code, understand the why behind things, and leave every project a little better than it was. I prefer simple solutions, honest feedback, and teams where you can learn out loud without fear of being wrong.',
                sentence: 'I am the person who double-checks if the fridge is closed; I like to make sure everything is in its place before considering something finished.',
                skills: 'Core Competencies',
                languages: 'Languages',
                more: 'More About Me',
                sentenceTitle: 'A sentence that defines me'
            },
            skills: {
                heading: 'Technical Expertise'
            },
            experience: {
                heading: 'Work History',
            },
            projects: {
                heading: 'All Projects',
                featured: 'Featured Projects',
                viewAll: 'View All',
                viewLive: 'View Live',
                openGallery: 'Open image gallery for {{title}}',
                gallery: {
                    close: 'Close gallery',
                    zoomIn: 'Zoom in',
                    zoomOut: 'Zoom out',
                    resetZoom: 'Reset zoom',
                    previousImage: 'Previous image',
                    nextImage: 'Next image',
                    thumbnail: 'View image {{index}} of {{total}} for {{title}}'
                },
                types: {
                    WEB: 'Web App',
                    DESKTOP: 'Desktop App',
                    MOBILE: 'Mobile App',
                    OTHER: 'Other'
                }
            },
            contact: {
                subtitle: 'Feel free to reach out',
                heading: 'Get In Touch',
                description: 'I am open to new professional opportunities. If you have a project or a job offer, I would love to hear from you.',
                email: 'Email',
                location: 'Location',
                social: 'FOLLOW ME',
                form: {
                    name: 'Name',
                    email: 'Email',
                    message: 'Message',
                    submit: 'Send Message',
                    success: 'Message sent successfully!',
                    emailJsNotConfigured: 'EmailJS not configured correctly. Please check your environment variables.'
                }
            },
            emptyState: {
                projects: {
                    title: 'Building the Future',
                    description: 'No projects here yet, but great things are in the making.'
                },
                featured: {
                    title: 'Highlights Coming Soon',
                    description: 'Curating the best projects to showcase here.'
                },
                experience: {
                    title: 'The Journey Begins',
                    description: 'Every expert was once a beginner. My professional path starts here.'
                },
                skills: {
                    title: 'Unlocking Potential',
                    description: 'Skills are being honed and added. Stay tuned for updates.'
                }
            },
            common: {
                loading: 'Loading...',
                error: 'An error occurred',
                present: 'Present',
                sending: 'Sending...',
                skipToContent: 'Skip to main content',
                returnToTop: 'Return to top',
                theme: {
                    light: 'Light',
                    dark: 'Dark',
                    glass: 'Liquid Glass'
                },
                languages: {
                    en: 'English',
                    es: 'Spanish'
                },
                errorBoundaryTitle: 'Something went wrong',
                errorBoundaryDescription: 'An unexpected error occurred. Please try refreshing the page.',
                errorBoundaryRefresh: 'Refresh Page'
            },
            footer: {
                rights: 'All rights reserved.',
            },
            seo: {
                home: {
                    title: 'Gonzalo Martinez | Full Stack Developer & Web App Specialist',
                    description: 'Portfolio of Gonzalo Martinez, a Full Stack Developer specialized in React, Java Spring Boot and modern web architectures. Based in Palma de Mallorca, Spain.'
                },
                about: {
                    title: 'About Me | Gonzalo Martinez',
                    description: 'Learn about Gonzalo Martinez, a Full Stack Developer based in Palma de Mallorca, Spain. Discover my journey, philosophy, skills and professional background.'
                },
                skills: {
                    title: 'Skills | Gonzalo Martinez',
                    description: 'Explore the technical skills of Gonzalo Martinez, a Full Stack Developer proficient in React, TypeScript, Java, Spring Boot and modern web technologies.'
                },
                experience: {
                    title: 'Experience | Gonzalo Martinez',
                    description: 'View the professional experience of Gonzalo Martinez, a Full Stack Developer with expertise in web application development and modern architectures.'
                },
                projects: {
                    title: 'Projects | Gonzalo Martinez',
                    description: 'Browse portfolio projects by Gonzalo Martinez, showcasing web applications built with React, TypeScript, Java and modern development stacks.'
                },
                contact: {
                    title: 'Contact | Gonzalo Martinez',
                    description: 'Get in touch with Gonzalo Martinez for professional opportunities, collaborations, or project inquiries. Based in Palma de Mallorca, Spain.'
                }
            }
        },
    },
    es: {
        translation: {
            nav: {
                home: 'Inicio',
                about: 'Sobre Mí',
                skills: 'Habilidades',
                experience: 'Experiencia',
                projects: 'Proyectos',
                contact: 'Contacto',
            },
            home: {
                cta: 'Ver Proyectos',
                resume: 'Descargar CV',
                name: 'Gonzalo Martinez',
                jobTitle: 'Desarrollador Full Stack junior',
                description: 'Desarrollador Full Stack junior. Aprendo rápido, me adapto a nuevas tecnologías y disfruto creando soluciones web útiles y mantenibles.',
                chips: {
                    frontend: 'Desarrollador Frontend',
                    backend: 'Arquitecto Backend',
                    uiux: 'Entusiasta UI/UX',
                    passion: '<Código /> con pasión'
                }
            },
            about: {
                subtitle: 'QUIÉN SOY',
                jobTitle: 'Desarrollador Full Stack junior',
                summary: 'Mi trayectoria empezó con un fuerte interés por entender cómo funcionan los sistemas, lo que me llevó a completar un grado en Sistemas Microinformáticos y Redes. Después me especialicé en Desarrollo de Aplicaciones Web y descubrí que lo que más disfruto es construir aplicaciones completas, desde el front‑end hasta el back‑end.\n\nHoy busco mi primera oportunidad como desarrollador Full Stack junior, abierto a aprender nuevas tecnologías, aportar valor al equipo y crecer paso a paso, ya sea en roles de frontend, backend o full stack.',
                title: 'Desarrollador Full Stack junior',
                philosophy: 'Me gusta escribir código claro, entender el porqué de las cosas y dejar cada proyecto un poco mejor de lo que estaba. Prefiero soluciones sencillas, feedback honesto y equipos donde se pueda aprender en voz alta sin miedo a equivocarse.',
                sentence: 'Soy la persona que revisa dos veces si ha cerrado bien la nevera; me gusta asegurarme de que todo queda en su sitio antes de dar algo por terminado.',
                skills: 'Competencias Principales',
                languages: 'Idiomas',
                more: 'Más Sobre Mí',
                sentenceTitle: 'Una frase que me define'
            },
            skills: {
                heading: 'Experiencia Técnica'
            },
            experience: {
                heading: 'Historial Laboral',
            },
            projects: {
                heading: 'Todos los Proyectos',
                featured: 'Proyectos Destacados',
                viewAll: 'Ver Todos',
                viewLive: 'Ver Demo',
                openGallery: 'Abrir galería de imágenes de {{title}}',
                gallery: {
                    close: 'Cerrar galería',
                    zoomIn: 'Acercar',
                    zoomOut: 'Alejar',
                    resetZoom: 'Restablecer zoom',
                    previousImage: 'Imagen anterior',
                    nextImage: 'Imagen siguiente',
                    thumbnail: 'Ver imagen {{index}} de {{total}} de {{title}}'
                },
                types: {
                    WEB: 'App Web',
                    DESKTOP: 'App de Escritorio',
                    MOBILE: 'App Móvil',
                    OTHER: 'Otro'
                }
            },
            contact: {
                subtitle: 'No dudes en comunicarte',
                heading: 'Contacto',
                description: 'Estoy abierto a nuevas oportunidades profesionales. Si tienes un proyecto o una oferta de trabajo, me encantaría escucharte.',
                email: 'Correo',
                location: 'Ubicación',
                social: 'SÍGUEME',
                form: {
                    name: 'Nombre',
                    email: 'Correo',
                    message: 'Mensaje',
                    submit: 'Enviar Mensaje',
                    success: '¡Mensaje enviado con éxito!',
                    emailJsNotConfigured: 'EmailJS no está configurado correctamente. Por favor, revisa tus variables de entorno.'
                }
            },
            emptyState: {
                projects: {
                    title: 'Construyendo el Futuro',
                    description: 'Aún no hay proyectos aquí, pero grandes cosas se están gestando.'
                },
                featured: {
                    title: 'Destacados Próximamente',
                    description: 'Seleccionando los mejores proyectos para mostrar aquí.'
                },
                experience: {
                    title: 'El Viaje Comienza',
                    description: 'Todo experto fue una vez principiante. Mi trayectoria profesional empieza aquí.'
                },
                skills: {
                    title: 'Desbloqueando Potencial',
                    description: 'Las habilidades se están perfeccionando y añadiendo. Mantente al tanto.'
                }
            },
            common: {
                loading: 'Cargando...',
                error: 'Ocurrió un error',
                present: 'Presente',
                sending: 'Enviando...',
                skipToContent: 'Saltar al contenido',
                returnToTop: 'Volver arriba',
                theme: {
                    light: 'Claro',
                    dark: 'Oscuro',
                    glass: 'Liquid Glass'
                },
                languages: {
                    en: 'Inglés',
                    es: 'Español'
                },
                errorBoundaryTitle: 'Algo salió mal',
                errorBoundaryDescription: 'Ocurrió un error inesperado. Por favor, intenta recargar la página.',
                errorBoundaryRefresh: 'Recargar Página'
            },
            footer: {
                rights: 'Todos los derechos reservados.',
            },
            seo: {
                home: {
                    title: 'Gonzalo Martinez | Desarrollador Full Stack',
                    description: 'Portafolio de Gonzalo Martinez, un Desarrollador Full Stack especializado en React, Java Spring Boot y arquitecturas web modernas. En Palma de Mallorca, España.'
                },
                about: {
                    title: 'Sobre Mí | Gonzalo Martinez',
                    description: 'Conoce a Gonzalo Martinez, un Desarrollador Full Stack en Palma de Mallorca, España. Descubre mi trayectoria, filosofía, habilidades y experiencia profesional.'
                },
                skills: {
                    title: 'Habilidades | Gonzalo Martinez',
                    description: 'Explora las habilidades técnicas de Gonzalo Martinez, un Desarrollador Full Stack con experiencia en React, TypeScript, Java, Spring Boot y tecnologías web modernas.'
                },
                experience: {
                    title: 'Experiencia | Gonzalo Martinez',
                    description: 'Conoce la experiencia profesional de Gonzalo Martinez, un Desarrollador Full Stack con experiencia en desarrollo de aplicaciones web y arquitecturas modernas.'
                },
                projects: {
                    title: 'Proyectos | Gonzalo Martinez',
                    description: 'Explora los proyectos de Gonzalo Martinez, que muestran aplicaciones web construidas con React, TypeScript, Java y stacks de desarrollo modernos.'
                },
                contact: {
                    title: 'Contacto | Gonzalo Martinez',
                    description: 'Ponte en contacto con Gonzalo Martinez para oportunidades profesionales, colaboraciones o consultas sobre proyectos. En Palma de Mallorca, España.'
                }
            }
        },
    },
};

const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;

    const systemLang = navigator.language.split('-')[0];
    return ['en', 'es'].includes(systemLang) ? systemLang : 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
