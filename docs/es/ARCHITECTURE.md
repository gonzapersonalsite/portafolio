# 🏗️ Guía de Arquitectura

[🇺🇸 English](../../ARCHITECTURE.md) | **🇪🇸 Español**

Este documento proporciona un análisis detallado de los patrones arquitectónicos, principios de diseño y decisiones tecnológicas para el proyecto Portfolio. Para despliegue, infraestructura y configuración de entorno, ver la [Guía de Operaciones](OPERATIONS.md).

---

## 🏗️ Arquitectura y Principios

El proyecto sigue una arquitectura **Full Stack** desacoplada, asegurando alto rendimiento, escalabilidad y seguridad.

### 🏛️ Arquitectura Backend
- **Diseño en Capas:** Separación estricta de preocupaciones usando el patrón **Controlador-Servicio-Repositorio**.
- **API RESTful:** Protocolo de comunicación sin estado para todas las interacciones frontend-backend.
- **Seguridad Primero:** Implementación de **Spring Security** con **JWT (JSON Web Tokens)** para autenticación sin estado.
- **Integridad de Datos:** Gestión de transacciones vía Spring Data JPA y manejo automatizado de esquemas.

### ⚛️ Arquitectura Frontend
- **Componentes Modulares:** UI construida con componentes React reutilizables y Material UI (MUI).
- **Gestión de Estado:** Estado global ligero usando **Zustand**.
- **Context API:** Usado para preocupaciones transversales como Tema, Idioma y Notificaciones.
- **Localización Dinámica:** Sistema centralizado i18next para traducción de interfaz en tiempo real.

---

## 📚 Documentación API

El backend genera automáticamente documentación interactiva usando **Swagger/OpenAPI**.
- **Endpoint:** `/swagger-ui/index.html`
- **Especificación:** `/v3/api-docs`
