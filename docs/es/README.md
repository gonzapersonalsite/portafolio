# 🚀 Portafolio Profesional Full Stack

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

[🇺🇸 English](../../README.md) | 🇪🇸 **Español**

**Portafolio Profesional** es una solución de software integral diseñada para la gestión dinámica de contenido y la presentación profesional. Esta aplicación Full Stack permite a los desarrolladores gestionar su perfil profesional, proyectos y habilidades a través de una interfaz administrativa segura, mientras ofrece una experiencia inmersiva a los visitantes.

**Demo en Vivo:** [https://mi-portafolio-gonzalo.vercel.app/](https://mi-portafolio-gonzalo.vercel.app/)  
**Documentación API:** [https://portafolio-9uob.onrender.com/swagger-ui/index.html](https://portafolio-9uob.onrender.com/swagger-ui/index.html)

---

## ✨ Características Principales

### 👨‍💼 Sistema de Gestión de Contenidos (CMS)
- **Panel de Administración No-Code:** Acceso exclusivo vía login seguro (Spring Security + JWT) para **CRUD completo** en Proyectos, Experiencias, Habilidades y Perfil. **Añade/actualiza todo sin una sola línea de código** – los cambios son visibles instantáneamente en el sitio público.
- **Actualizaciones en Tiempo Real:** Contenido dinámico siempre actualizado para los visitantes.
- **Autenticación Segura:** Login robusto impulsado por Spring Security y JWT.


### 🎨 Experiencia de Usuario Inmersiva (UX)
- **Interfaz Liquid Glass:** Estilo visual de vanguardia inspirado en visionOS, con glassmorphism avanzado y acentos neón.
- **Motor de Temas:** Sistema centralizado que soporta modos Claro, Oscuro y el exclusivo Liquid Glass.
- **Localización Dinámica:** Soporte bilingüe completo (Español/Inglés) con traducción instantánea de interfaz y contenido.

### 📦 Inteligencia de Proyectos
- **Integración con GitHub:** Obtención automática de las últimas releases binarias (.exe, .apk) directamente desde repositorios de GitHub.
- **Diseño Responsivo:** Diseños fluidos optimizados para escritorio, tablet y móvil.
- **Fondos Animados:** Animaciones CSS de alto rendimiento para una sensación moderna e interactiva.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + TypeScript (Vite)
- **Framework UI:** Material UI (MUI) con personalización profunda de temas
- **Backend:** Java 21 + Spring Boot 3.4
- **Seguridad:** Spring Security & JWT (JSON Web Tokens)
- **Base de Datos:** PostgreSQL (Neon Serverless)
- **Gestión de Estado:** Zustand
- **Documentación API:** Swagger / OpenAPI 3.0
- **Herramientas de Construcción:** Gradle (Backend) & NPM (Frontend)

---

## 🏗️ Arquitectura y Principios

El proyecto sigue una **Arquitectura Full Stack** moderna, priorizando escalabilidad, seguridad y mantenibilidad.

- **Backend en Capas Limpio:** Patrón Controlador-Servicio-Repositorio para una clara separación de la lógica de negocio.
- **Frontend Basado en Componentes:** Componentes UI altamente reutilizables con gestión de estado centralizada.
- **CI/CD Automatizado:** Pipeline de despliegue continuo usando Vercel (Frontend) y Render (Backend).
- **Persistencia de Datos:** Gestión robusta de esquemas con Spring Data JPA y PostgreSQL.

📖 **[Guía de Arquitectura](ARCHITECTURE.md)** — Patrones, decisiones de diseño y documentación de API.
🛠️ **[Guía de Operaciones](../../OPERATIONS.md)** — Despliegue, CI/CD, variables de entorno y configuración local.

---

## 🚀 Ejecución Local

Este proyecto está contenerizado para facilitar el despliegue y desarrollo local.

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.
- Archivo `.env` configurado con las variables de entorno necesarias (ver `../../OPERATIONS.md`).

### Iniciar la Aplicación
```bash
docker compose up -d
```

**Acceder a la aplicación:**
- Frontend: [http://localhost:5173/](http://localhost:5173/)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

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
