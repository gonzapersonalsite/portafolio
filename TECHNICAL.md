# Documentación Técnica

Este documento detalla la arquitectura, tecnologías y decisiones de diseño del proyecto.

## 🏗 Arquitectura Global

El proyecto sigue una arquitectura **Full Stack** clásica separada en dos servicios principales:

*   **Frontend (Cliente):** Aplicación SPA (Single Page Application) moderna.
*   **Backend (Servidor):** API RESTful robusta.
*   **Base de Datos:** Relacional (PostgreSQL) containerizada.

## 💻 Frontend (`/frontend`)

### Tecnologías Clave
*   **Framework:** React 18 con TypeScript (creado via Vite).
*   **UI Library:** Material UI (MUI) v5. Diseño adaptativo y tema claro/oscuro.
*   **Estado:** Zustand (gestión ligera de estado global, ej: Autenticación).
*   **Routing:** React Router DOM v6.
*   **HTTP Client:** Axios con interceptores para manejo de tokens JWT.

### Sistema de Traducciones (i18n)
El proyecto utiliza una estrategia híbrida de internacionalización:
1.  **UI Estática (Botones, Menús):** Gestionada por `react-i18next`. Los archivos JSON están en `src/locales`.
2.  **Contenido Dinámico (Proyectos, Experiencias):** Se almacena en la base de datos con columnas duplicadas (ej: `description_en`, `description_es`). El frontend decide qué campo mostrar según el idioma seleccionado en el contexto global (`LanguageContext`).

### Decisiones de Diseño Frontend
*   **Componentes Reutilizables:** Uso intensivo de componentes genéricos (`ConfirmDialog`, `RichTextRenderer`, `ImageWithFallback`) para mantener el código DRY (Don't Repeat Yourself).
*   **Rich Text Personalizado:** Implementación de un renderizador de texto propio (`RichTextRenderer`) para soportar listas y párrafos limpios sin el peso y riesgo de seguridad de un editor HTML completo.

---

## ⚙️ Backend (`/backend`)

### Tecnologías Clave
*   **Framework:** Java Spring Boot 3.
*   **Seguridad:** Spring Security 6 + JWT (JSON Web Tokens).
*   **Persistencia:** Spring Data JPA + Hibernate.
*   **Base de Datos:** PostgreSQL 16.
*   **Validación:** Bean Validation (Jakarta Validation).

### Arquitectura Backend
Sigue el patrón de capas estándar:
1.  **Controllers:** Manejan las peticiones HTTP y DTOs.
2.  **Services:** Contienen la lógica de negocio.
3.  **Repositories:** Interfaz con la base de datos (JPA).
4.  **Security:** Filtros JWT para proteger endpoints administrativos (`/api/admin/**`).

---

## 🚀 Guía de Despliegue (Deployment)

En mi caso, opto por Vercel (frontend) y Render (backend), aprovechando sus planes gratuitos y CI/CD automáticos. Teóricamente (y con práctica en DAW), domino despliegues tradicionales: Tomcat para apps Java/Spring Boot (manejo WAR/JAR, configuración server.xml), Apache/Nginx como reverse proxy/SSL (virtual hosts, mod_proxy), y pipelines CI básicos. Elijo PaaS para este portafolio por simplicidad y escalabilidad sin O&M manual.

### 1. Frontend (Vercel)

Configuración específica para desplegar la carpeta `/frontend` en Vercel.

| Configuración | Valor | Notas |
| :--- | :--- | :--- |
| **Framework Preset** | Vite | Vercel suele detectarlo automáticamente. |
| **Root Directory** | `frontend` | **Importante:** Debes indicar que el proyecto está en esta subcarpeta. |
| **Build Command** | `npm run build` | Compila el TypeScript y genera los estáticos. |
| **Output Directory** | `dist` | Carpeta donde Vite deja los archivos compilados. |
| **Install Command** | `npm install` | Instala las dependencias. |

**Variables de Entorno (Environment Variables):**
Debes configurarlas en el panel de Vercel (Settings -> Environment Variables):

*   `VITE_API_BASE_URL`: La URL pública de tu backend en producción (ej: `https://mi-backend.onrender.com/api`).
*   `VITE_EMAILJS_SERVICE_ID`: Tu ID de servicio de EmailJS.
*   `VITE_EMAILJS_TEMPLATE_ID`: Tu ID de plantilla de EmailJS.
*   `VITE_EMAILJS_PUBLIC_KEY`: Tu clave pública de EmailJS.

### 2. Backend (Render / Railway)
*Requiere Dockerfile o configuración de Java/Maven.*
*   **Build Command:** `./mvnw clean package -DskipTests`
*   **Start Command:** `java -jar target/*.jar`
*   **Variables:** `SPRING_DATASOURCE_URL`, `JWT_SECRET`, etc.
