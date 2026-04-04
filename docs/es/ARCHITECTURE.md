# 🏗️ Guía de Arquitectura

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

[🇺🇸 English](../../ARCHITECTURE.md) | 🇪🇸 **Español**

Este documento proporciona un análisis detallado de los patrones arquitectónicos, principios de diseño y decisiones tecnológicas para el proyecto Portfolio. Para despliegue, infraestructura y configuración de entorno, ver la [Guía de Operaciones](../../OPERATIONS.md).

---

## 🏗️ Arquitectura y Principios

El proyecto sigue una arquitectura **Full Stack** desacoplada, asegurando alto rendimiento, escalabilidad y seguridad.

### 🏛️ Arquitectura Backend
- **Diseño en Capas:** Separación estricta de preocupaciones usando el patrón **Controlador-Servicio-Repositorio**.
- **Protección del Dominio:** Uso de Data Transfer Objects (DTOs) para aislar las entidades de dominio de la capa web.
- **API RESTful:** Protocolo de comunicación sin estado para todas las interacciones frontend-backend.
- **Seguridad Primero:** Implementación de **Spring Security** con **JWT (JSON Web Tokens)** para autenticación sin estado, y estricta sanitización de entradas para prevenir XSS.
- **Integridad de Datos:** Gestión de transacciones vía Spring Data JPA y manejo automatizado de esquemas.

### ⚛️ Arquitectura Frontend
- **Componentes Modulares:** UI construida con componentes React reutilizables y Material UI (MUI), adhiriéndose estrictamente al Principio de Responsabilidad Única (SRP).
- **Gestión de Estado:** Estado global ligero usando **Zustand**.
- **Context API:** Usado para preocupaciones transversales como Tema, Idioma y Notificaciones.
- **Localización Dinámica:** Sistema centralizado i18next para traducción de interfaz en tiempo real.

---

## 📚 Documentación API

El backend genera automáticamente documentación interactiva usando **Swagger/OpenAPI**.
- **Endpoint:** `/swagger-ui/index.html`
- **Especificación:** `/v3/api-docs`

### Diseño de API REST
- Rutas basadas en recursos bajo el prefijo `/api`, siguiendo convenciones **RESTful**.
- Segmentación por responsabilidad:
  - Público: `/api/public` — solo lectura mediante **GET**.
  - Administración: `/api/admin` — **GET** (lectura), **POST** (creación, 201), **PUT** (actualización idempotente), **DELETE** (eliminación, 204).
  - Autenticación: `/api/auth` — operaciones idempotentes y de sesión según el verbo (p. ej., `POST /login`, `GET /validate`).
- Códigos de estado estándar: 200 en lecturas/actualizaciones exitosas, 201 en creaciones, 204 en eliminaciones.
- La lista completa de endpoints puede evolucionar y se consulta siempre en Swagger. Esta guía no duplica endpoints específicos para evitar discrepancias.

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