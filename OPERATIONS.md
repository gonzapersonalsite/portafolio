# 🛠️ Operations Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-25-ED8B00?logo=openjdk)](https://openjdk.org/)
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
- **Database:** [Aiven](https://aiven.io/) (PostgreSQL).

### 🚀 CI/CD Pipeline
Current deployment flow with pre‑deployment quality gate:
- **Frontend (Vercel):**
  - Vercel auto‑deploys on every push to `main` from the `frontend/` directory.
  - Vercel auto‑detects pnpm via the `packageManager` field in `package.json`.
  - GitHub Actions runs typecheck + lint on pushes/PRs touching `frontend/**` as an early warning gate.
  - Required Vercel env var: `PNPM_APPROVE_BUILDS=true` (pnpm v11 security requirement).
  - Vercel dashboard: set Install Command to `pnpm install` and Build Command to `pnpm run build`.
- **Backend (container on Render):**
  - GitHub Actions runs backend tests on pushes to `main` within `backend/portfolio-backend/**`.
  - If tests pass, CI invokes the private **Deploy Hook** for the Render service to start the deploy.
  - In Render, the service has **Auto‑Deploy disabled**; it only deploys when the hook is called.
  - The backend `Dockerfile` builds with `./gradlew build -x test` for fast builds (tests already run in CI).

Pipeline details:
- Backend workflow: `.github/workflows/backend-ci.yml`
- Frontend workflow: `.github/workflows/frontend-ci.yml`
- Required GitHub secret: `RENDER_DEPLOY_HOOK_URL` (the service's Deploy Hook from Render)
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
- `PNPM_APPROVE_BUILDS`: Set to `true` in Vercel to allow esbuild build scripts (pnpm v11+ requirement).

### Backend
- `SPRING_DATASOURCE_URL`: Aiven PostgreSQL connection string.
- `SPRING_DATASOURCE_USERNAME`: Aiven database username.
- `SPRING_DATASOURCE_PASSWORD`: Aiven database password.
- `ADMIN_USERNAME`: Default admin username.
- `ADMIN_PASSWORD`: Default admin password.
- `JWT_SECRET`: Secret key for secure token generation.
- `CORS_ORIGINS`: Allowed frontend domain.
- `JWT_EXPIRATION`: JWT token expiration time (ms).
- `JPA_DDL_AUTO`: Schema management strategy (`validate` for prod, `update` for local dev).
- `FLYWAY_ENABLED`: Enable Flyway migrations (default `true`).
- `RATE_LIMIT_ENABLED`: Enable/disable rate limiting on public and admin endpoints.
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

### Tests (backend)
Unit tests covering service layer and security components:
- **Service tests:** `src/test/java/.../application/service/` — Authentication, Experience, Profile, Project, Skill, SpokenLanguage services.
- **Security tests:** `src/test/java/.../infrastructure/security/` — InputSanitizer, TokenBucketRateLimiter.

Gradle commands:
- Run tests: `./gradlew test`
- Run app: `./gradlew bootRun`
- Build JAR: `./gradlew build -x test`

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
