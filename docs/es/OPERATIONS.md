# 🛠️ Guía de Operaciones

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk)](https://openjdk.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-yellow?logo=swagger)](https://swagger.io/)
[![Status](https://img.shields.io/badge/Status-Proprietario-red.svg)](#-licencia)

[🇺🇸 English](../../OPERATIONS.md) | 🇪🇸 **Español**

Este documento cubre la infraestructura, el pipeline de despliegue, la configuración del entorno y la configuración para el desarrollo local del proyecto Portfolio.

---

## ☁️ Infraestructura y Despliegue

El proyecto está diseñado para alta disponibilidad utilizando servicios modernos nativos de la nube.

### Proveedores Cloud
- **Hosting Frontend:** [Vercel](https://vercel.app) (Optimizado para aplicaciones React/Vite).
- **Hosting Backend:** [Render](https://render.com) (Despliegue basado en contenedores).
- **Base de Datos:** [Neon](https://neon.tech) (PostgreSQL Serverless).

### 🚀 Pipeline CI/CD
El despliegue está completamente automatizado vía integración con GitHub:
1. **Frontend:** Construcción y despliegue automático en Vercel al hacer push a `main`.
2. **Backend:** Render dispara una construcción Docker usando el `Dockerfile` proporcionado en cada actualización.

---

## 🔧 Configuración del Entorno

Variables clave requeridas para producción:

### Frontend
- `VITE_API_BASE_URL`: URL completa al endpoint API de Render.
- `VITE_EMAILJS_SERVICE_ID`: Identificador del servicio EmailJS.
- `VITE_EMAILJS_TEMPLATE_ID`: Identificador de la plantilla EmailJS.
- `VITE_EMAILJS_PUBLIC_KEY`: Clave pública de EmailJS.

### Backend
- `SPRING_DATASOURCE_URL`: Cadena de conexión PostgreSQL de Neon.
- `SPRING_DATASOURCE_USERNAME`: Usuario de base de datos Neon.
- `SPRING_DATASOURCE_PASSWORD`: Contraseña de base de datos Neon.
- `ADMIN_USERNAME`: Nombre de usuario administrador por defecto.
- `ADMIN_PASSWORD`: Contraseña de administrador por defecto.
- `JWT_SECRET`: Clave secreta para la generación segura de tokens.
- `CORS_ORIGINS`: Dominio frontend permitido.
- `JWT_EXPIRATION`: Tiempo de expiración del token JWT (ms).
- `RATE_LIMIT_ENABLED`: Habilitar/deshabilitar límite de tasa.

---

## 🛠️ Desarrollo Local

### Inicio Rápido
La forma más fácil de ejecutar la base de datos, el backend y el frontend localmente es vía Docker Compose:

```bash
docker compose up -d
```

Asegúrate de que tu archivo `.env` esté configurado correctamente con las variables listadas arriba.

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