# 🏗️ Architecture Guide

**🇺🇸 English** | [🇪🇸 Español](docs/es/ARCHITECTURE.md)

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

---

## 🚫 Legal Notice

**© 2026 Gonzalo Martínez García. All rights reserved.**

This architectural design and implementation is **proprietary information**.
- **Unauthorized copying**, reproduction, or use of this documentation or the associated software is strictly prohibited.
- See the `LICENSE` file for full terms and conditions.
