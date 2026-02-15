# 🏗️ Architecture Guide

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![Status](https://img.shields.io/badge/Status-Proprietary-red.svg)](#-license)

🇺🇸 **English** | [🇪🇸 Español](docs/es/ARCHITECTURE.md)

This document provides a detailed analysis of the architectural patterns, design principles, and technology decisions for the Portfolio project. For deployment, infrastructure, and environment configuration, see the [Operations Guide](OPERATIONS.md).

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

## 📚 API Documentation

The backend automatically generates interactive documentation using **Swagger/OpenAPI**.
- **Endpoint:** `/swagger-ui/index.html`
- **Specification:** `/v3/api-docs`

### REST API Design
- Resource-based routes under `/api`, adhering to **RESTful** conventions.
- Responsibility split:
  - Public: `/api/public` — read-only via **GET**.
  - Admin: `/api/admin` — **GET** (read), **POST** (create, 201), **PUT** (idempotent update), **DELETE** (delete, 204).
  - Auth: `/api/auth` — session and idempotent operations according to the HTTP verb (e.g., `POST /login`, `GET /validate`).
- Standard status codes: 200 for successful reads/updates, 201 for creations, 204 for deletions.
- The full set of endpoints evolves and is always sourced from Swagger. This guide intentionally avoids duplicating specific endpoint lists to prevent drift.

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
