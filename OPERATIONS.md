# 🛠️ Operations Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![Status](https://img.shields.io/badge/Status-Proprietary-red.svg)](#-license)

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
The deployment is fully automated via GitHub integration:
1. **Frontend:** Automatic build and deployment on Vercel upon pushing to `main`.
2. **Backend:** Render triggers a Docker build using the provided `Dockerfile` on every update.

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

---

## 🛠️ Local Development

### Quick Start
The easiest way to run the database, backend, and frontend locally is via Docker Compose:

```bash
docker compose up -d
```

Ensure your `.env` file is properly configured with the variables listed above.

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