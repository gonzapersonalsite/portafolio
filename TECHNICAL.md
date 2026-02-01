# Guía Técnica del Proyecto Portafolio

Este documento detalla la arquitectura, tecnologías y procedimientos de despliegue para el proyecto Portafolio.

## Arquitectura

*   **Frontend:** React (Vite) + TypeScript + Material UI.
*   **Backend:** Java (Spring Boot 3) + PostgreSQL.
*   **Base de Datos:** PostgreSQL (Neon Tech).
*   **Despliegue Frontend:** Vercel.
*   **Despliegue Backend:** Koyeb.

## Despliegue (Producción)

### 1. Base de Datos (Neon Tech)
*   **Plataforma:** Neon (Serverless PostgreSQL).
*   **Región:** AWS Europe (Frankfurt) - `eu-central-1`.
*   **Conexión:** `jdbc:postgresql://<host>/<database>?sslmode=require`.

### 2. Backend (Koyeb)
*   **Plataforma:** Koyeb (PaaS).
*   **Región:** Frankfurt (para baja latencia con la DB).
*   **Build:** Dockerfile.
*   **Variables de Entorno (Koyeb):**
    *   `SPRING_DATASOURCE_URL`: URL completa de Neon (con `?sslmode=require`).
    *   `SPRING_DATASOURCE_USERNAME`: Usuario de Neon (`neondb_owner`).
    *   `SPRING_DATASOURCE_PASSWORD`: Contraseña de Neon.
    *   `JWT_SECRET`: Clave secreta para tokens.
    *   `ADMIN_USERNAME`: Usuario administrador.
    *   `ADMIN_PASSWORD`: Contraseña administrador.
    *   `CORS_ORIGINS`: `https://mi-portafolio-gonzalo.vercel.app`

### 3. Frontend (Vercel)
*   **Plataforma:** Vercel.
*   **Conexión con Backend:**
    1.  Obtener la **Public URL** del servicio en Koyeb (ej: `https://mi-backend.koyeb.app`).
    2.  Ir a Vercel -> Project Settings -> Environment Variables.
    3.  Añadir:
        *   **Key:** `VITE_API_BASE_URL`
        *   **Value:** `https://written-christalle-gonzalomartinezgarcia-4b1d8f11.koyeb.app/api`
    4.  Redesplegar el Frontend en Vercel (Redeploy).

## Flujo de Actualizaciones (CI/CD)

El proyecto está configurado con **Despliegue Continuo**. Esto significa que:

1.  **Haces cambios** en tu código local.
2.  **Haces commit y push** a la rama `main` en GitHub.
3.  ☁️ **Vercel** detecta el cambio en GitHub y **redespliega el Frontend** automáticamente.
4.  ☁️ **Koyeb** detecta el cambio en GitHub y **redespliega el Backend** automáticamente.

¡No necesitas hacer nada manual! Solo esperar unos minutos a que los cambios se reflejen.

## Desarrollo Local

### Requisitos
*   Node.js & npm
*   Java 21 (JDK)
*   Docker (opcional, para DB local) o conexión a Neon.

### Ejecución
1.  **Backend:** `./gradlew bootRun`
2.  **Frontend:** `npm run dev`

### Estructura de Carpetas
*   `/backend`: Código fuente Java/Spring Boot.
*   `/frontend`: Código fuente React/TypeScript.

## Enlaces Útiles (Producción)

*   **Frontend:** `https://mi-portafolio-gonzalo.vercel.app`
*   **API Base:** `https://written-christalle-gonzalomartinezgarcia-4b1d8f11.koyeb.app/api`
*   **Documentación API (Swagger):** `https://written-christalle-gonzalomartinezgarcia-4b1d8f11.koyeb.app/swagger-ui/index.html`
*   **Panel Admin:** `https://mi-portafolio-gonzalo.vercel.app/admin/login`
