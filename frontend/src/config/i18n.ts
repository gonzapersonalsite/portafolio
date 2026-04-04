import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
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
                admin: 'Admin',
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
                heading: 'My Story',
                introTitle: 'Software Developer based in Palma de Mallorca, Spain',
                jobTitle: 'Junior Full Stack Developer',
                summary: 'My journey began with a strong interest in understanding how systems work, which led me to complete a degree in Microcomputer Systems and Networks. Later, I specialized in Web Application Development and discovered that what I enjoy most is building complete applications, from front-end to back-end.\n\nToday I am looking for my first opportunity as a junior Full Stack developer, open to learning new technologies, contributing value to the team, and growing step by step, whether in frontend, backend, or full stack roles.',
                title: 'Junior Full Stack Developer',
                philosophy: 'I like to write clear code, understand the why behind things, and leave every project a little better than it was. I prefer simple solutions, honest feedback, and teams where you can learn out loud without fear of being wrong.',
                detailedPhilosophy: 'I like to write clear code, understand the why behind things, and leave every project a little better than it was. I prefer simple solutions, honest feedback, and teams where you can learn out loud without fear of being wrong.',
                sentence: 'I am the person who double-checks if the fridge is closed; I like to make sure everything is in its place before considering something finished.',
                skills: 'Core Competencies',
                languages: 'Languages',
                more: 'More About Me',
                sentenceTitle: 'A sentence that defines me'
            },
            skills: {
                title: 'My Skills',
                subtitle: 'Technologies and tools I work with',
                heading: 'Technical Expertise'
            },
            experience: {
                title: 'Work Experience',
                subtitle: 'My professional journey',
                heading: 'Work History',
                present: 'Present',
            },
            projects: {
                title: 'Featured Projects',
                subtitle: 'Recent work and personal projects',
                heading: 'All Projects',
                featured: 'Featured Projects',
                viewAll: 'View All',
                allProjects: 'All Projects',
                features: 'Features',
                viewCode: 'View Code',
                viewLive: 'View Live',
                download: 'Download',
                types: {
                    WEB: 'Web App',
                    DESKTOP: 'Desktop App',
                    MOBILE: 'Mobile App',
                    OTHER: 'Other'
                }
            },
            contact: {
                title: 'Get In Touch',
                subtitle: 'Feel free to reach out',
                heading: 'Get In Touch',
                description: 'I am open to new professional opportunities. If you have a project or a job offer, I would love to hear from you.',
                email: 'Email',
                location: 'Location',
                address: 'Palma de Mallorca, Spain',
                social: 'FOLLOW ME',
                form: {
                    name: 'Name',
                    email: 'Email',
                    message: 'Message',
                    submit: 'Send Message',
                    success: 'Message sent successfully!'
                }
            },
            admin: {
                login: 'Login',
                logout: 'Logout',
                backToPublic: 'Back to Public',
                dashboard: 'Dashboard',
                username: 'Username',
                password: 'Password',
                profile: 'Profile Management',
                skills: 'Skills Management',
                experiences: 'Experiences Management',
                projects: 'Projects Management',
                languages: 'Languages Management',
                externalResources: 'External Resources',
                externalResourcesDescription: 'Quick access to external tools and services connected to this portfolio.',
                add: 'Add New',
                edit: 'Edit',
                delete: 'Delete',
                save: 'Save Changes',
                cancel: 'Cancel',
                confirm: 'Confirm',
                confirmDeleteTitle: 'Confirm Deletion',
                confirmDeleteMessage: 'Are you sure you want to delete this item? This action cannot be undone.',

                // Form Labels
                name: 'Name',
                title: 'Title',
                subtitle: 'Subtitle',
                description: 'Description',
                company: 'Company',
                position: 'Position',
                startDate: 'Start Date',
                endDate: 'End Date',
                technologies: 'Technologies (comma separated)',
                order: 'Order',
                featured: 'Featured Project',
                proficiency: 'Proficiency (%)',
                category: 'Category',
                level: 'Level',
                url: 'URL',
                imageUrl: 'Image URL',
                imageUrls: 'Image URLs (one per line, first is cover)',
                githubUrl: 'GitHub URL',
                liveUrl: 'Live URL',
                projectType: 'Project Type',
                email: 'Contact Email',
                location: 'Location',
                fullName: 'Full Name',
                logoText: 'Navbar Logo Text',
                cvUrl: 'CV File URL (PDF)',
                philosophy: 'Philosophy',
                generalCv: 'General / CV',
                personalSocial: 'Personal / Social',
                sentence: 'Sentence that defines me',
                linkedinUrl: 'LinkedIn URL',
                backend: 'Backend',
                frontend: 'Frontend',
                database: 'Base de Datos',
                tools: 'Herramientas',
                other: 'Otro',

                // Alerts & Feedback
                saving: 'Saving...',
                saveSuccess: 'Changes saved successfully!',
                deleteSuccess: 'Item deleted successfully!',
                fetchError: 'Failed to fetch data.',
                saveError: 'Failed to save changes.',
                deleteError: 'Failed to delete item.',
                loginError: 'Invalid credentials.',
                invalidCredentials: 'Invalid credentials. Please check your username and password.',
                welcomeBack: 'Welcome back! Please enter your credentials.',
                genericError: 'An unexpected error occurred.',
                resources: {
                    postImages: {
                        description: 'Used to upload images and generate direct URLs for use in the portfolio (projects, skills, etc.).',
                        action: 'Go to PostImages'
                    },
                    emailJs: {
                        description: 'Manages the contact form functionality. Used to view email logs, templates, and API keys.',
                        action: 'Go to EmailJS'
                    },
                    vercel: {
                        description: 'Manage frontend deployments, domains, and production environment variables.',
                        action: 'Go to Vercel'
                    },
                    aiven: {
                        description: 'Manage Aiven PostgreSQL database, users, and connection settings.',
                        action: 'Go to Aiven Console'
                    },
                    render: {
                        description: 'Manage backend deployments, logs, and environment variables for the Spring Boot application.',
                        action: 'Go to Render'
                    },
                    uptimeRobot: {
                        description: 'Monitor backend availability and uptime statistics. Keeps the backend awake.',
                        action: 'Go to UptimeRobot'
                    },
                    mediaFire: {
                        description: 'Used to upload downloadable projects like .exe and similar files.',
                        action: 'Go to MediaFire'
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
                }
            },
            common: {
                loading: 'Loading...',
                error: 'An error occurred',
                success: 'Success!',
                language: 'Language',
                noProjects: 'No featured projects yet.',
                present: 'Present',
                sending: 'Sending...',
                skipToContent: 'Skip to main content',
                returnToTop: 'Return to top',
                actions: 'Actions',
                theme: {
                    light: 'Light',
                    dark: 'Dark',
                    glass: 'Liquid Glass'
                },
                languages: {
                    en: 'English',
                    es: 'Spanish'
                },
                coldStartNotice: 'Welcome! As this project is on a free plan, the first load may take a few seconds while the server wakes up. Thanks for your patience! 🙇'
            },
            footer: {
                rights: 'All rights reserved.',
                madeWith: 'Made with',
                using: 'using'
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
                admin: 'Admin',
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
                heading: 'Mi Historia',
                introTitle: 'Desarrollador de Software en Palma de Mallorca, España',
                jobTitle: 'Desarrollador Full Stack junior',
                summary: 'Mi trayectoria empezó con un fuerte interés por entender cómo funcionan los sistemas, lo que me llevó a completar un grado en Sistemas Microinformáticos y Redes. Después me especialicé en Desarrollo de Aplicaciones Web y descubrí que lo que más disfruto es construir aplicaciones completas, desde el front‑end hasta el back‑end.\n\nHoy busco mi primera oportunidad como desarrollador Full Stack junior, abierto a aprender nuevas tecnologías, aportar valor al equipo y crecer paso a paso, ya sea en roles de frontend, backend o full stack.',
                title: 'Desarrollador Full Stack junior',
                philosophy: 'Me gusta escribir código claro, entender el porqué de las cosas y dejar cada proyecto un poco mejor de lo que estaba. Prefiero soluciones sencillas, feedback honesto y equipos donde se pueda aprender en voz alta sin miedo a equivocarse.',
                detailedPhilosophy: 'Me gusta escribir código claro, entender el porqué de las cosas y dejar cada proyecto un poco mejor de lo que estaba. Prefiero soluciones sencillas, feedback honesto y equipos donde se pueda aprender en voz alta sin miedo a equivocarse.',
                sentence: 'Soy la persona que revisa dos veces si ha cerrado bien la nevera; me gusta asegurarme de que todo queda en su sitio antes de dar algo por terminado.',
                skills: 'Competencias Principales',
                languages: 'Idiomas',
                more: 'Más Sobre Mí',
                sentenceTitle: 'Una frase que me define'
            },
            skills: {
                title: 'Mis Habilidades',
                subtitle: 'Tecnologías y herramientas con las que trabajo',
                heading: 'Experiencia Técnica'
            },
            experience: {
                title: 'Experiencia Laboral',
                subtitle: 'Mi trayectoria profesional',
                heading: 'Historial Laboral',
                present: 'Presente',
            },
            projects: {
                title: 'Proyectos Destacados',
                subtitle: 'Trabajos recientes y proyectos personales',
                heading: 'Todos los Proyectos',
                featured: 'Proyectos Destacados',
                viewAll: 'Ver Todos',
                allProjects: 'Todos los Proyectos',
                features: 'Características',
                viewCode: 'Ver Código',
                viewLive: 'Ver Demo',
                download: 'Descargar',
                types: {
                    WEB: 'App Web',
                    DESKTOP: 'App de Escritorio',
                    MOBILE: 'App Móvil',
                    OTHER: 'Otro'
                }
            },
            contact: {
                title: 'Contáctame',
                subtitle: 'No dudes en comunicarte',
                heading: 'Contacto',
                description: 'Estoy abierto a nuevas oportunidades profesionales. Si tienes un proyecto o una oferta de trabajo, me encantaría escucharte.',
                email: 'Correo',
                location: 'Ubicación',
                address: 'Palma de Mallorca, España',
                social: 'SÍGUEME',
                form: {
                    name: 'Nombre',
                    email: 'Correo',
                    message: 'Mensaje',
                    submit: 'Enviar Mensaje',
                    success: '¡Mensaje enviado con éxito!'
                }
            },
            admin: {
                login: 'Iniciar Sesión',
                logout: 'Cerrar Sesión',
                backToPublic: 'Volver al Inicio Público',
                dashboard: 'Panel de Control',
                username: 'Usuario',
                password: 'Contraseña',
                profile: 'Gestión del Perfil',
                skills: 'Gestión de Habilidades',
                experiences: 'Gestión de Experiencias',
                projects: 'Gestión de Proyectos',
                languages: 'Gestión de Idiomas',
                externalResources: 'Recursos Externos',
                externalResourcesDescription: 'Acceso rápido a herramientas y servicios externos conectados a este portafolio.',
                add: 'Añadir Nuevo',
                edit: 'Editar',
                delete: 'Eliminar',
                save: 'Guardar Cambios',
                cancel: 'Cancelar',
                confirm: 'Confirmar',
                confirmDeleteTitle: 'Confirmar Eliminación',
                confirmDeleteMessage: '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',

                // Form Labels
                name: 'Nombre',
                title: 'Título',
                sentence: 'Frase que me define',
                subtitle: 'Subtítulo',
                description: 'Descripción',
                company: 'Empresa',
                position: 'Puesto',
                startDate: 'Fecha de Inicio',
                endDate: 'Fecha de Fin',
                technologies: 'Tecnologías (separadas por coma)',
                order: 'Orden',
                featured: 'Proyecto Destacado',
                proficiency: 'Competencia (%)',
                category: 'Categoría',
                level: 'Nivel',
                url: 'URL',
                imageUrl: 'URL de Imagen',
                imageUrls: 'URLs de imágenes (una por línea, la primera es portada)',
                imageUrlHint: 'Introduce la URL completa de tu foto profesional (PostImages, ImgBB, etc).',
                githubUrl: 'URL de GitHub',
                liveUrl: 'URL de Demo',
                projectType: 'Tipo de Proyecto',
                email: 'Correo de Contacto',
                location: 'Ubicación',
                fullName: 'Nombre Completo',
                logoText: 'Texto del Logo',
                cvUrl: 'URL del CV (PDF)',
                philosophy: 'Filosofía',
                generalCv: 'General / CV',
                personalSocial: 'Personal / Social',
                linkedinUrl: 'URL de LinkedIn',
                backend: 'Backend',
                frontend: 'Frontend',
                database: 'Base de Datos',
                tools: 'Herramientas',
                other: 'Otro',

                // Alerts & Feedback
                saving: 'Guardando...',
                saveSuccess: '¡Cambios guardados con éxito!',
                deleteSuccess: '¡Elemento eliminado con éxito!',
                fetchError: 'Error al cargar los datos.',
                saveError: 'Error al guardar los cambios.',
                deleteError: 'Error al eliminar el elemento.',
                loginError: 'Credenciales inválidas.',
                invalidCredentials: 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.',
                welcomeBack: '¡Bienvenido de nuevo! Por favor, introduce tus credenciales.',
                genericError: 'Ha ocurrido un error inesperado.',
                resources: {
                    postImages: {
                        description: 'Utilizado para subir imágenes y generar URLs directas para su uso en el portafolio (proyectos, habilidades, etc.).',
                        action: 'Ir a PostImages'
                    },
                    emailJs: {
                        description: 'Gestiona la funcionalidad del formulario de contacto. Utilizado para ver registros de correos, plantillas y claves API.',
                        action: 'Ir a EmailJS'
                    },
                    vercel: {
                        description: 'Gestiona los despliegues del frontend, dominios y variables de entorno de producción.',
                        action: 'Ir a Vercel'
                    },
                    aiven: {
                        description: 'Gestiona la base de datos PostgreSQL en Aiven, usuarios y configuración de conexión.',
                        action: 'Ir a Consola Aiven'
                    },
                    render: {
                        description: 'Gestiona los despliegues del backend, registros y variables de entorno para la aplicación Spring Boot.',
                        action: 'Ir a Render'
                    },
                    uptimeRobot: {
                        description: 'Monitoriza la disponibilidad y estadísticas del backend. Mantiene el backend despierto.',
                        action: 'Ir a UptimeRobot'
                    },
                    mediaFire: {
                        description: 'Lo uso para subir los proyectos descargables en plan .exe y similares.',
                        action: 'Ir a MediaFire'
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
                }
            },
            common: {
                loading: 'Cargando...',
                error: 'Ocurrió un error',
                success: '¡Éxito!',
                language: 'Idioma',
                noProjects: 'Aún no hay proyectos destacados.',
                present: 'Presente',
                sending: 'Enviando...',
                skipToContent: 'Saltar al contenido',
                returnToTop: 'Volver arriba',
                actions: 'Acciones',
                theme: {
                    light: 'Claro',
                    dark: 'Oscuro',
                    glass: 'Liquid Glass'
                },
                languages: {
                    en: 'Inglés',
                    es: 'Español'
                },
                coldStartNotice: '¡Bienvenido! Como este proyecto está en un plan gratuito, la primera carga puede tardar unos segundos mientras el servidor se activa. ¡Gracias por tu paciencia! 🙇'
            },
            footer: {
                rights: 'Todos los derechos reservados.',
                madeWith: 'Hecho con',
                using: 'usando'
            }
        },
    },
};

// Detect user language
const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;

    const systemLang = navigator.language.split('-')[0]; // 'en-US' -> 'en'
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
