# 🚀 Portafolio Profesional

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)](https://vite.dev/)
[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 [English](../README.md) | **🇪🇸 Español**

**Portafolio Profesional** es una aplicación web estática diseñada para mostrar una carrera profesional: proyectos, experiencia, habilidades y perfil, con una interfaz inmersiva y animada.

**Demo en vivo:** [https://mi-portafolio-gonzalo.vercel.app/](https://mi-portafolio-gonzalo.vercel.app/)

---

## ✨ Características Principales

### 🎨 Experiencia de Usuario Inmersiva (UX)
- **Interfaz Liquid Glass:** estilo visual vanguardista inspirado en visionOS, con glassmorphism avanzado y acentos de neón.
- **Galería de Proyectos Interactiva:** showcases de múltiples imágenes a pantalla completa con zoom nativo.
- **Motor de Temas:** sistema centralizado con modo Claro, Oscuro y el exclusivo modo Liquid Glass.
- **Localización Dinámica:** soporte bilingüe completo (español/inglés) con traducción instantánea de interfaz y contenido.

### 📦 Contenido como Datos
- **Modelo de contenido JSON estático:** proyectos, habilidades, experiencia, perfil e idiomas viven en ficheros JSON versionados — sin CMS, sin API, sin base de datos. Añadir un proyecto es un cambio de datos, no de código.
- **Imágenes autohospedadas:** todas las imágenes de proyectos y perfil se sirven desde el propio sitio — cero hosts de imágenes de terceros.
- **Formulario de contacto:** impulsado por EmailJS (solo navegador, sin backend).
- **Diseño Responsive:** layouts fluidos optimizados para escritorio, tablet y móvil.
- **Fondos Animados:** animaciones CSS de alto rendimiento para un look moderno e interactivo.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React + TypeScript (Vite)
- **UI:** Material UI (MUI) con personalización profunda de temas
- **Routing:** React Router con páginas lazy-loaded
- **i18n:** i18next + react-i18next
- **Contacto:** EmailJS (solo navegador)
- **Testing:** Vitest + Testing Library
- **Gestión de paquetes:** pnpm

---

## 🏗️ Arquitectura y Principios

El proyecto sigue una **arquitectura de frontend estático** moderna, priorizando mantenibilidad, rendimiento y coste operativo cero.

- **Frontend Feature-Sliced:** arquitectura FSD de 6 capas (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`) con límites de importación estrictos aplicados por ESLint.
- **Modelo de Contenido Estático:** contenido bilingüe en JSON por entidad, validado por tests de integridad de datos.
- **CI/CD Automatizado:** pipeline de despliegue continuo con Vercel.

📖 **[Guía de Arquitectura](ARCHITECTURE.md)** — Patrones y decisiones de diseño.
🛠️ **[Guía de Operaciones](OPERATIONS.md)** — Despliegue, CI/CD, variables de entorno y setup local.

---

## 🚀 Ejecución Local

### Requisitos
- Node.js (ver `frontend/package.json` para la versión gestionada) y pnpm.

### Iniciar la Aplicación
```bash
cd frontend
pnpm install
pnpm dev
```

**Acceso:**
- Frontend: [http://localhost:5173/](http://localhost:5173/)

### Puertas de Calidad
```bash
pnpm lint     # ESLint (reglas FSD + TS)
pnpm test     # Vitest (unit + integridad del contenido)
pnpm build    # Compilación TypeScript + build de producción con Vite
```

---

## 🚫 Aviso Legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **únicamente con fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No está permitido el uso personal para otros portafolios.**
- Consulta el archivo [LICENSE](../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**
*Full Stack Developer | Software Engineering & Innovation*
