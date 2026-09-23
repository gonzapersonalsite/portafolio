# 🚀 Professional Portfolio

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 **English** | [🇪🇸 Español](docs/es/README.md)

**Professional Portfolio** is a static web application designed to showcase a professional career: projects, experience, skills, and profile — with an immersive, animated interface.

**Live Demo:** [https://mi-portafolio-gonzalo.vercel.app/](https://mi-portafolio-gonzalo.vercel.app/)

---

## ✨ Key Features

### 🎨 Immersive User Experience (UX)
- **Liquid Glass Interface:** Cutting-edge visual style inspired by visionOS, featuring advanced glassmorphism and neon accents.
- **Interactive Project Gallery:** Full-screen multi-image showcases with native zoom capabilities.
- **Theme Engine:** Centralized system supporting Light, Dark, and the exclusive Liquid Glass mode.
- **Dynamic Localization:** Full bilingual support (Spanish/English) with instant interface and content translation.

### 📦 Content as Data
- **Static JSON content model:** projects, skills, experience, profile, and spoken languages live in versioned JSON files — no CMS, no API, no database. Adding a project is a data change, not a code change.
- **Self-hosted images:** all project and profile images are served from the site itself — zero third-party image hosts.
- **Contact form:** powered by EmailJS (browser-only, no backend required).
- **Responsive Design:** fluid layouts optimized for desktop, tablet, and mobile devices.
- **Animated Backgrounds:** high-performance CSS animations for a modern, interactive feel.

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **UI Framework:** Material UI (MUI) with deep theme customization
- **Routing:** React Router with lazy-loaded pages
- **i18n:** i18next + react-i18next
- **Contact:** EmailJS (browser-only)
- **Testing:** Vitest + Testing Library
- **Build Tools:** pnpm

---

## 🏗️ Architecture & Principles

The project follows a modern **static frontend architecture**, prioritizing maintainability, performance, and zero operational cost.

- **Feature-Sliced Frontend:** 6-layer FSD architecture (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`) with strict import boundaries enforced by ESLint.
- **Static Content Model:** bilingual content in JSON per entity, validated by data-integrity tests.
- **Automated CI/CD:** continuous deployment pipeline using Vercel.
- **Agent-Readable Output:** `llms.txt`, robots/sitemap and English/Spanish markdown twins per route, generated at build time from the same JSON content.

📖 **[Architecture Guide](ARCHITECTURE.md)** — Patterns and design decisions.
🛠️ **[Operations Guide](OPERATIONS.md)** — Deployment, CI/CD, environment variables, and local setup.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (see `frontend/package.json` for the managed version) and pnpm.

### Start Application
```bash
cd frontend
pnpm install
pnpm dev
```

**Access the application:**
- Frontend: [http://localhost:5173/](http://localhost:5173/)

### Quality Gates
```bash
pnpm lint     # ESLint (FSD rules + TS rules)
pnpm test     # Vitest (unit + content-integrity tests)
pnpm build    # TypeScript compilation + Vite production build
```

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
