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
                description: 'Web application developer focused on creating intuitive and functional digital experiences.',
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
                title: 'Passionate about technology and development',
                summary: 'Software developer with a passion for creating efficient solutions. I enjoy working on both frontend and backend to deliver complete products.',
                philosophy: 'I believe in the importance of clean code and continuous improvement. Every project is an opportunity to learn and grow professionally.',
                skills: 'Core Competencies',
                languages: 'Languages',
                more: 'More About Me'
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
                githubUrl: 'GitHub URL',
                liveUrl: 'Live URL',
                email: 'Contact Email',
                location: 'Location',
                fullName: 'Full Name',
                logoText: 'Navbar Logo Text',
                cvUrl: 'CV File URL (PDF)',
                philosophy: 'Philosophy',
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
                    neon: {
                        description: 'Manage the serverless PostgreSQL database. View connection strings, tables, and data.',
                        action: 'Go to Neon Console'
                    },
                    koyeb: {
                        description: 'Manage backend deployments, logs, and environment variables for the Spring Boot application.',
                        action: 'Go to Koyeb'
                    }
                },
                emptyState: {
                    projects: {
                        title: 'Building the Future',
                        description: 'No projects here yet, but great things are in the making.'
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
                actions: 'Actions'
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
                description: 'Desarrollador de aplicaciones web enfocado en crear experiencias digitales intuitivas y funcionales.',
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
                title: 'Apasionado por la tecnología y el desarrollo',
                summary: 'Desarrollador de software con pasión por crear soluciones eficientes. Disfruto trabajando tanto en el frontend como en el backend para entregar productos completos.',
                philosophy: 'Creo en la importancia del código limpio y la mejora continua. Cada proyecto es una oportunidad para aprender y crecer profesionalmente.',
                skills: 'Competencias Principales',
                languages: 'Idiomas',
                more: 'Más Sobre Mí'
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
                imageUrlHint: 'Introduce la URL completa de tu foto profesional (PostImages, ImgBB, etc).',
                githubUrl: 'URL de GitHub',
                liveUrl: 'URL de Demo',
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
                    neon: {
                        description: 'Gestiona la base de datos PostgreSQL serverless. Ver cadenas de conexión, tablas y datos.',
                        action: 'Ir a Consola Neon'
                    },
                    koyeb: {
                        description: 'Gestiona los despliegues del backend, registros y variables de entorno para la aplicación Spring Boot.',
                        action: 'Ir a Koyeb'
                    }
                },
                emptyState: {
                    projects: {
                        title: 'Construyendo el Futuro',
                        description: 'Aún no hay proyectos aquí, pero grandes cosas se están gestando.'
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
                actions: 'Acciones'
            },
            footer: {
                rights: 'Todos los derechos reservados.',
                madeWith: 'Hecho con',
                using: 'usando'
            }
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
