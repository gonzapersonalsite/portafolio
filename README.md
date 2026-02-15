# 🚀 Professional Full Stack Portfolio

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 **English** | [🇪🇸 Español](docs/es/README.md)

**Professional Portfolio** is a comprehensive software solution designed for dynamic content management and professional career showcasing. This Full Stack application allows developers to manage their professional profile, projects, and skills through a secure administrative interface while providing an immersive experience for visitors.

**Live Demo:** [https://mi-portafolio-gonzalo.vercel.app/](https://mi-portafolio-gonzalo.vercel.app/)  
**API Documentation:** [https://portafolio-9uob.onrender.com/swagger-ui/index.html/](https://portafolio-9uob.onrender.com/swagger-ui/index.html/)

---

## ✨ Key Features

### 👨‍💼 Content Management System (CMS)
- **No-Code Admin Panel:** Access exclusively via secure login (Spring Security + JWT) for **full CRUD** on Projects, Experiences, Skills, and Profile. **Add/update everything without a single line of code** – live changes instantly visible on the public site.
- **Real-Time Updates:** Dynamic content always up-to-date for visitors.
- **Secure Authentication:** Robust login powered by Spring Security and JWT.


### 🎨 Immersive User Experience (UX)
- **Liquid Glass Interface:** Cutting-edge visual style inspired by visionOS, featuring advanced glassmorphism and neon accents.
- **Theme Engine:** Centralized system supporting Light, Dark, and the exclusive Liquid Glass mode.
- **Dynamic Localization:** Full bilingual support (Spanish/English) with instant interface and content translation.

### 📦 Project Intelligence
- **GitHub Integration:** Automated fetching of the latest binary releases (.exe, .apk) directly from GitHub repositories.
- **Responsive Design:** Fluid layouts optimized for desktop, tablet, and mobile devices.
- **Animated Backgrounds:** High-performance CSS animations for a modern, interactive feel.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript (Vite)
- **UI Framework:** Material UI (MUI) with deep theme customization
- **Backend:** Java 21 + Spring Boot 3.4
- **Security:** Spring Security & JWT (JSON Web Tokens)
- **Database:** PostgreSQL (Neon Serverless)
- **State Management:** Zustand
- **API Documentation:** Swagger / OpenAPI 3.0
- **Build Tools:** Gradle (Backend) & NPM (Frontend)

---

## 🏗️ Architecture & Principles

The project follows a modern **Full Stack Architecture**, prioritizing scalability, security, and maintainability.

- **Clean Layered Backend:** Controller-Service-Repository pattern for clear business logic separation.
- **Component-Driven Frontend:** Highly reusable UI components with centralized state management.
- **Automated CI/CD:** Continuous deployment pipeline using Vercel (Frontend) and Render (Backend).
- **Data Persistence:** Robust schema management with Spring Data JPA and PostgreSQL.

📖 **[Architecture Guide](ARCHITECTURE.md)** — Patterns, design decisions, and API documentation.
🛠️ **[Operations Guide](OPERATIONS.md)** — Deployment, CI/CD, environment variables, and local setup.

---

## 🚀 Running Locally

This project is containerized for easy deployment and local development.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- `.env` file configured with necessary environment variables (see `OPERATIONS.md`).

### Start Application
```bash
docker compose up -d
```

**Access the application:**
- Frontend: [http://localhost:5173/](http://localhost:5173/)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

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
