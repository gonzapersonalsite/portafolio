# 🚀 Portafolio profesional

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

🇺🇸 [English](../../README.md) | **🇪🇸 Español**

**Portafolio profesional** es una aplicación web estática y bilingüe que presenta la trayectoria de Gonzalo Martínez, desarrollador Full Stack junior: proyectos, experiencia, habilidades y perfil, con una interfaz inmersiva y animada.

**Demo en vivo:** [https://mi-portafolio-gonzalo.vercel.app/](https://mi-portafolio-gonzalo.vercel.app/)

---

## ✨ Características principales

### 🎨 Experiencia de usuario inmersiva (UX)
- **Interfaz Liquid Glass:** estilo visual vanguardista inspirado en visionOS, con glassmorphism avanzado y acentos de neón.
- **Galería de proyectos interactiva:** visor a pantalla completa con pies de imagen, tira de miniaturas, zoom hasta 4× (botones, clic o teclado) y navegación por teclado (flechas, +/−, 0).
- **Motor de temas:** modo claro, oscuro y el exclusivo modo Liquid Glass. El sitio sigue al sistema operativo hasta que el visitante elige un tema, y pinta el fondo correcto antes de que cargue la aplicación.
- **Localización dinámica:** soporte bilingüe completo (inglés/español) con traducción instantánea de interfaz y contenido. Añadir `?lang=es` a cualquier dirección comparte la página en español.

### 📦 Contenido como datos
- **Modelo de contenido JSON estático:** proyectos, habilidades, experiencia, perfil e idiomas viven en ficheros JSON versionados — sin CMS, sin API, sin base de datos. Añadir un proyecto es un cambio de datos, no de código.
- **Recursos autohospedados:** todas las imágenes, los iconos y la fuente (Inter) se sirven desde el propio sitio — cero hosts de imágenes o fuentes de terceros.
- **Formulario de contacto:** impulsado por EmailJS (solo navegador, sin backend), que se carga solo al enviar un mensaje.
- **Diseño responsive:** layouts fluidos optimizados para escritorio, tablet y móvil.
- **Fondos animados:** animaciones CSS de alto rendimiento para un look moderno e interactivo.

---

## 🛠️ Stack tecnológico

- **Frontend:** React + TypeScript (Vite)
- **UI:** Material UI (MUI) con personalización profunda de temas
- **Routing:** React Router con páginas lazy-loaded
- **i18n:** i18next + react-i18next
- **Contacto:** EmailJS (solo navegador)
- **Testing:** Vitest + Testing Library
- **Gestión de paquetes:** pnpm
- **Hosting:** Vercel (solo ficheros estáticos)

---

## 🏗️ Arquitectura y principios

El proyecto sigue una **arquitectura de frontend estático** moderna, priorizando mantenibilidad, rendimiento y coste operativo cero.

- **Frontend Feature-Sliced:** arquitectura FSD de 6 capas (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`) con límites de importación estrictos aplicados por ESLint.
- **Modelo de contenido estático:** contenido bilingüe en JSON por entidad, validado por tests de integridad de datos.
- **Despliegue continuo:** Vercel despliega cada push a `main`; GitHub Actions ejecuta lint, tests y el build de producción en cada cambio.
- **Salida para agentes y SEO:** una página HTML por ruta con sus propios metadatos y datos estructurados JSON-LD, además de `llms.txt`, robots/sitemap y copias markdown en inglés y español por ruta, todo generado en build desde el mismo contenido JSON.
- **Cabeceras de seguridad:** una Content-Security-Policy estricta (el único script en línea se permite por su hash) y las cabeceras de endurecimiento habituales en cada respuesta.

📖 **[Guía de arquitectura](ARCHITECTURE.md)** — Patrones y decisiones de diseño.
🛠️ **[Guía de operaciones](OPERATIONS.md)** — Despliegue, CI/CD, variables de entorno, gestión de contenido y setup local.

---

## 🚀 Ejecución local

### Requisitos
- Node.js (ver `frontend/package.json` para la versión gestionada) y pnpm.

### Iniciar la aplicación
```bash
cd frontend
pnpm install
pnpm dev
```

**Acceso:**
- Frontend: [http://localhost:5173/](http://localhost:5173/)

### Puertas de calidad
```bash
pnpm lint     # ESLint (reglas FSD + TS)
pnpm test     # Vitest (unit + integridad del contenido)
pnpm build    # Compilación TypeScript + build de producción con Vite
```

---

## 🚫 Aviso legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **únicamente con fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No está permitido el uso personal para otros portafolios.**
- Consulta el archivo [LICENSE](../../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**
*Desarrollador Full Stack junior | Ingeniería de software e innovación*
