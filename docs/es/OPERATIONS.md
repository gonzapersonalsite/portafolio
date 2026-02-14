# 🛠️ Guía de Operaciones

[🇺🇸 English](../../OPERATIONS.md) | **🇪🇸 Español**

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
