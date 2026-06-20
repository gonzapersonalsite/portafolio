# 🛠️ Guía de Operaciones

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

[🇺🇸 English](../../OPERATIONS.md) | 🇪🇸 **Español**

Este documento cubre la infraestructura, el pipeline de despliegue, la configuración del entorno y la configuración para el desarrollo local del proyecto Portfolio.

---

## ☁️ Infraestructura y Despliegue

El proyecto está diseñado para alta disponibilidad utilizando servicios modernos nativos de la nube.

### Proveedores Cloud
- **Hosting Frontend:** [Vercel](https://vercel.app) (Optimizado para aplicaciones React/Vite).
- **Hosting Backend:** [Render](https://render.com) (Despliegue basado en contenedores).
- **Base de Datos:** [Aiven](https://aiven.io/) (PostgreSQL).

### 🚀 Pipeline CI/CD
Flujo actual de despliegue con control de calidad previo:
- **Frontend (Vercel):**
  - Vercel despliega automáticamente en cada push a `main` desde el directorio `frontend/`.
  - Vercel detecta automáticamente pnpm mediante el campo `packageManager` en `package.json`.
  - GitHub Actions ejecuta typecheck + lint en pushes/PRs que afecten a `frontend/**` como verificación de alerta temprana.
  - Variable de entorno requerida en Vercel: `PNPM_APPROVE_BUILDS=true` (requisito de seguridad de pnpm v11).
  - Panel de Vercel: configura el comando de instalación como `pnpm install` y el comando de compilación como `pnpm run build`.
- **Backend (contenedor en Render):**
  - GitHub Actions ejecuta los tests de backend al hacer push a `main` en `backend/portfolio-backend/**`.
  - Si los tests pasan, CI invoca el **Deploy Hook** privado de Render para iniciar el deploy.
  - En Render, el servicio tiene **Auto‑Deploy desactivado**; solo se despliega cuando el hook es llamado.
  - El `Dockerfile` de backend compila el artefacto con `./gradlew build -x test` para builds rápidos (los tests ya corren en CI).

Detalles del pipeline:
- Workflow backend: `.github/workflows/backend-ci.yml`
- Workflow frontend: `.github/workflows/frontend-ci.yml`
- Secret requerido en GitHub: `RENDER_DEPLOY_HOOK_URL` (Deploy Hook del servicio en Render)
- Configuración en Render:
  - Settings → Build & Deploy → Auto‑Deploy = Off
  - Deploy Hook: copiar y usar en el secret de GitHub

---

## 🔧 Configuración del Entorno

Variables clave requeridas para producción:

### Frontend
- `VITE_API_BASE_URL`: URL completa al endpoint API de Render.
- `VITE_EMAILJS_SERVICE_ID`: Identificador del servicio EmailJS.
- `VITE_EMAILJS_TEMPLATE_ID`: Identificador de la plantilla EmailJS.
- `VITE_EMAILJS_PUBLIC_KEY`: Clave pública de EmailJS.
- `PNPM_APPROVE_BUILDS`: Configurar como `true` en Vercel para permitir scripts de compilación de esbuild (requisito de pnpm v11+).

### Backend
- `SPRING_DATASOURCE_URL`: Cadena de conexión PostgreSQL de Aiven.
- `SPRING_DATASOURCE_USERNAME`: Usuario de base de datos Aiven.
- `SPRING_DATASOURCE_PASSWORD`: Contraseña de base de datos Aiven.
- `ADMIN_USERNAME`: Nombre de usuario administrador por defecto.
- `ADMIN_PASSWORD`: Contraseña de administrador por defecto.
- `JWT_SECRET`: Clave secreta para la generación segura de tokens.
- `CORS_ORIGINS`: Dominio frontend permitido.
- `JWT_EXPIRATION`: Tiempo de expiración del token JWT (ms).
- `JPA_DDL_AUTO`: Estrategia de gestión del esquema (`validate` para prod, `update` para desarrollo local).
- `FLYWAY_ENABLED`: Habilitar migraciones Flyway (por defecto `true`).
- `RATE_LIMIT_ENABLED`: Habilitar/deshabilitar límite de tasa.
- `SPRING_PROFILES_ACTIVE`: Debe ser `prod` en producción para desactivar el seeder.

Seguridad y acceso:
- Todas las rutas bajo `/api/admin/**` requieren rol `ADMIN`.
- Autenticación basada en JWT; los tokens no se almacenan en servidor (stateless).
- Los tests no incluyen secretos reales; cualquier clave en `src/test/resources` es solo de ámbito test.

Seeder:
- El seeder del backend ha sido completamente eliminado como parte de la migración a la Arquitectura Hexagonal. El esquema de la base de datos y el estado inicial se manejan enteramente a través de migraciones de Flyway.

---

## 🛠️ Desarrollo Local

### Inicio Rápido
La forma más fácil de ejecutar la base de datos, el backend y el frontend localmente es vía Docker Compose:

```bash
docker compose up -d
```

Asegúrate de que tu archivo `.env` esté configurado correctamente con las variables listadas arriba.

### Tests (backend)
Tests unitarios que cubren la capa de servicio y los componentes de seguridad:
- **Tests de servicio:** `src/test/java/.../application/service/` — Servicios Authentication, Experience, Profile, Project, Skill, SpokenLanguage.
- **Tests de seguridad:** `src/test/java/.../infrastructure/security/` — InputSanitizer, TokenBucketRateLimiter.

Comandos Gradle:
- Ejecutar tests: `./gradlew test`
- Ejecutar app: `./gradlew bootRun`
- Generar JAR: `./gradlew build -x test`

---

## 🚫 Aviso Legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **exclusivamente para fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No se permite el uso personal para otros portafolios.**
- Ver el archivo [LICENSE](../../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**  
*Full Stack Developer | Software Engineering & Innovation*
