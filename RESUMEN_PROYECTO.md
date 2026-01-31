# Resumen Ejecutivo del Portfolio Profesional

Este documento resume la arquitectura, tecnologías y criterios de diseño utilizados en el desarrollo del portfolio de Gonzalo Martinez.

## 🚀 Tecnologías Principales

### Frontend
- **React 18 + TypeScript + Vite**: Base sólida, tipada y con compilación ultra-rápida.
- **Material-UI (MUI) v6**: Sistema de diseño profesional, responsive y con soporte nativo para modo oscuro.
- **React i18next**: Gestión de internacionalización (EN/ES) dinámica.
- **Zustand**: Gestión de estado ligera para la autenticación.
- **EmailJS**: Integración de formulario de contacto sin necesidad de servidor SMTP propio.

### Backend
- **Java 17 + Spring Boot 3**: Framework robusto para la lógica de negocio y seguridad.
- **Spring Security + JWT**: Autenticación apátrida (stateless) segura para el panel de administración.
- **Spring Data JPA + PostgreSQL**: Persistencia de datos relacional escalable.
- **Springdoc (Swagger)**: Documentación interactiva de la API.
- **Lombok / MapStruct**: Reducción de código repetitivo (Boilerplate) y mapeo eficiente de DTOs.

---

## 🏗️ Estructura y Criterios de Diseño

### Backend (Arquitectura por Capas / Hexagonal Soft)
- **Domain**: Entidades puras de negocio (Skill, Project, Experience, Profile).
- **Application/Services**: Lógica de negocio central. Aquí se gestiona el filtrado, la validación y el procesamiento de datos.
- **Infrastructure**: Configuración técnica (Seguridad, Base de Datos, i18n, Swagger).
- **Web/Controllers**: Endpoints REST. Se separaron en interfaces públicas (`/api/public/**`) y administrativas protegidas (`/api/admin/**`).

**¿Por qué esta estructura?**
Permite un desacoplamiento claro. Si en el futuro se quiere cambiar la base de datos o el motor de seguridad, la lógica de negocio (el core) permanece intacta.

### Frontend (Estructura Modular)
- **Components**: Separados por funcionalidad (Common, Layout, Portfolio, Admin).
- **Pages**: Rutas principales del sitio, diferenciando entre la vista pública y el Dashboard.
- **Context/Store**: Gestión de temas, idiomas y sesión de usuario.
- **Services**: Capa de comunicación con la API (Axios), abstrayendo las llamadas del UI.

---

## 🌍 Gestión de Idiomas (i18n)
Se ha implementado una estrategia mixta:
1. **Contenido Estático**: Títulos de botones, etiquetas de formularios y menús se gestionan mediante archivos JSON localmente en el frontend.
2. **Contenido Dinámico**: Biografías, descripciones de proyectos y experiencias se almacenan por duplicado en la base de datos (campos `titleEn` / `titleEs`, etc.). El frontend renderiza la variante correcta según el estado actual de `i18next`.

---

## ☁️ Guía de Despliegue

### Frontend (Vercel)
1. Conectar el repositorio de GitHub.
2. Configurar las variables de entorno:
   - `VITE_API_BASE_URL`: URL de tu backend en Render.
   - `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_PUBLIC_KEY`.
3. Comando de build: `npm run build`.

### Backend (Render)
1. Crear un **Web Service** para el backend y una base de datos **PostgreSQL**.
2. Variables de entorno críticas:
   - `DATABASE_URL`: URL de conexión proporcionada por Render.
   - `DATABASE_USER`, `DATABASE_PASSWORD`.
   - `JWT_SECRET`: Una clave larga y segura.
   - `CORS_ORIGINS`: La URL de tu sitio en Vercel (ej: `https://mi-portfolio.vercel.app`).
   - `SPRING_PROFILES_ACTIVE`: `prod` (para desactivar el seeder de pruebas).

---

## 🛡️ Auditoría de Seguridad y Robustez
Se ha realizado una revisión exhaustiva para garantizar que el sistema es "Production Ready":
- **Gestión de Estados HTTP**: El backend diferencia ahora correctamente entre `401 Unauthorized` (falta de token) y `403 Forbidden` (token válido pero sin permisos). Esto cumple con los estándares RFC y facilita la integración con el frontend.
- **Protección de Endpoints**: Todas las rutas de administración están protegidas bajo el prefijo `/api/admin/**`. Sin un JWT válido, el acceso es denegado de forma determinista.
- **Prevención de Ataques**: Se han habilitado políticas de CORS estrictas y límites de velocidad (Rate Limiting) para prevenir abusos.

---

## ✅ Mejoras de Experiencia de Usuario (UX)
- **Diálogos de Confirmación Profesionales**: Se han sustituido los alerts nativos por un componente `ConfirmDialog` reutilizable basado en MUI. Esto ofrece una experiencia integrada y evita bloqueos del navegador.
- **Localización Dinámica**: Todos los mensajes de confirmación están plenamente integrados con `react-i18next`.

---

**Estado del Proyecto: Finalizado y Pulido** 🚀
El sistema es ahora más profesional, robusto y está 100% listo para ser desplegado.
