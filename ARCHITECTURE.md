# 🏗️ Architecture & Operations Guide

This document provides a detailed analysis of the architectural patterns, technology stack, and operational procedures for the Portfolio project.

---

## 🏗️ Architecture & Principles

The project follows a decoupled **Full Stack** architecture, ensuring high performance, scalability, and security.

### 🏛️ Backend Architecture
- **Layered Design:** Strict separation of concerns using the **Controller-Service-Repository** pattern.
- **RESTful API:** Stateless communication protocol for all frontend-backend interactions.
- **Security First:** Implementation of **Spring Security** with **JWT (JSON Web Tokens)** for stateless authentication.
- **Data Integrity:** Transaction management via Spring Data JPA and automated schema handling.

### ⚛️ Frontend Architecture
- **Modular Components:** UI built with reusable React components and Material UI (MUI).
- **State Management:** Lightweight global state using **Zustand**.
- **Context API:** Used for cross-cutting concerns like Theme, Language, and Notifications.
- **Dynamic Localization:** Centralized i18next system for real-time interface translation.

---

## 🛠️ Infrastructure & Deployment

The project is designed for high availability using modern cloud-native services.

### ☁️ Cloud Providers
- **Frontend Hosting:** [Vercel](https://vercel.app) (Optimized for React/Vite applications).
- **Backend Hosting:** [Render](https://render.com) (Container-based deployment).
- **Database:** [Neon](https://neon.tech) (Serverless PostgreSQL).

### 🚀 CI/CD Pipeline
The deployment is fully automated via GitHub integration:
1. **Frontend:** Automatic build and deployment on Vercel upon pushing to `main`.
2. **Backend:** Render triggers a Docker build using the provided `Dockerfile` on every update.

### 🔧 Environment Configuration
Key variables required for production:

#### Frontend
- `VITE_API_BASE_URL`: Full URL to the Render API endpoint.
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service identifier.
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template identifier.
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key.

#### Backend
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

## 🛠️ Development Setup

### Prerequisites
- **Node.js:** v18 or higher.
- **Java JDK:** 21 (Temurin recommended).
- **Build Tools:** Gradle (via `./gradlew`).

### Local Execution
1. **Backend:**
   ```bash
   cd backend/portfolio-backend
   ./gradlew bootRun
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📚 API Documentation
The backend automatically generates interactive documentation using **Swagger/OpenAPI**.
- **Endpoint:** `/swagger-ui/index.html`
- **Specification:** `/v3/api-docs`
