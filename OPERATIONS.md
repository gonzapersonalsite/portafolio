# 🛠️ Operations Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 **English** | [🇪🇸 Español](docs/es/OPERATIONS.md)

This document covers the infrastructure, deployment pipeline, environment configuration, and local development setup for the Portfolio project.

---

## ☁️ Infrastructure & Deployment

The project is designed for high availability using modern cloud-native services.

### Cloud Providers
- **Frontend Hosting:** [Vercel](https://vercel.app) (Optimized for React/Vite applications).
- **Backend Hosting:** [Render](https://render.com) (Container-based deployment).
- **Database:** [Neon](https://neon.tech) (Serverless PostgreSQL).

### 🚀 CI/CD Pipeline
Current deployment flow with pre‑deployment quality gate:
- **Frontend:** Automatic build and deploy on Vercel upon pushing to `main`.
- **Backend (container on Render):**
  - GitHub Actions runs backend tests on pushes to `main` within `backend/portfolio-backend/**`.
  - If tests pass, CI invokes the private **Deploy Hook** for the Render service to start the deploy.
  - In Render, the service has **Auto‑Deploy disabled**; it only deploys when the hook is called.
  - The backend `Dockerfile` builds with `./gradlew build -x test` for fast builds (tests already run in CI).

Pipeline details:
- Workflow: `.github/workflows/backend-ci.yml`
- Required GitHub secret: `RENDER_DEPLOY_HOOK_URL` (the service’s Deploy Hook from Render)
- Render configuration:
  - Settings → Build & Deploy → Auto‑Deploy = Off
  - Deploy Hook: copy and store as a GitHub secret

---

## 🔧 Environment Configuration

Key variables required for production:

### Frontend
- `VITE_API_BASE_URL`: Full URL to the Render API endpoint.
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service identifier.
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template identifier.
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key.

### Backend
- `SPRING_DATASOURCE_URL`: Neon PostgreSQL connection string.
- `SPRING_DATASOURCE_USERNAME`: Neon database username.
- `SPRING_DATASOURCE_PASSWORD`: Neon database password.
- `ADMIN_USERNAME`: Default admin username.
- `ADMIN_PASSWORD`: Default admin password.
- `JWT_SECRET`: Secret key for secure token generation.
- `CORS_ORIGINS`: Allowed frontend domain.
- `JWT_EXPIRATION`: JWT token expiration time (ms).
- `RATE_LIMIT_ENABLED`: Enable/disable rate limiting.
- `SPRING_PROFILES_ACTIVE`: Must be `prod` in production to disable the seeder.

Security and access:
- All routes under `/api/admin/**` require role `ADMIN`.
- Stateless JWT authentication; tokens are not stored on the server.
- Tests do not include real secrets; any keys in `src/test/resources` are for test scope only.

Seeder:
- Data seeder is annotated with profile `!prod`; it will not run in production.
- Set `SPRING_PROFILES_ACTIVE=prod` in production environments.

---

## 🛠️ Local Development

### Quick Start
The easiest way to run the database, backend, and frontend locally is via Docker Compose:

```bash
docker compose up -d
```

Ensure your `.env` file is properly configured with the variables listed above.

### Local tests (backend)
- Run tests: `./gradlew test`
- Run app: `./gradlew bootRun`
- Build JAR: `./gradlew build -x test`

### Security test suite (backend)
- Location: `backend/portfolio-backend/src/test/java/com/gonzalomartinez/portfolio_backend/infrastructure/web/admin/`
- Minimal coverage:
  - 401 when unauthenticated for `/api/admin/**`
  - 403 for authenticated user without `ADMIN` role
  - 2xx with `ADMIN` role and service invocation verified

---

## 🚫 Legal Notice

**© 2026 Gonzalo Martínez García. All rights reserved.**

This software is **proprietary** and is provided for **evaluation purposes only**.
- **Unauthorized copying**, modification, distribution, or use of this software, via any medium, is strictly prohibited.
- **Personal use for other portfolios is not allowed.**
- See the [LICENSE](LICENSE) file for full terms and conditions.

---

**Developed by Gonzalo Martínez García**  
*Full Stack Developer | Software Engineering & Innovation*
