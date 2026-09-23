# 🛠️ Operations Guide

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 **English** | [🇪🇸 Español](docs/es/OPERATIONS.md)

This document covers the infrastructure, deployment pipeline, environment configuration, and local development setup for the Portfolio project.

---

## ☁️ Infrastructure & Deployment

The project is **static-only** — a single deployment, zero servers.

### Cloud Provider
- **Frontend Hosting:** [Vercel](https://vercel.app) (optimized for React/Vite applications), root directory `frontend/`.

### 🚀 CI/CD Pipeline
- **Frontend (Vercel):**
  - Vercel auto-deploys on every push to `main` from the `frontend/` directory.
  - Vercel auto-detects pnpm via the `packageManager` field in `package.json`.
  - GitHub Actions runs typecheck + lint + tests + production build on pushes/PRs touching `frontend/**` as a quality gate.
  - Required Vercel env var: `PNPM_APPROVE_BUILDS=true` (pnpm security requirement). The same approval is declared in-repo for local/CI installs: `frontend/.npmrc` (`only-built-dependencies[]=esbuild`) and `frontend/pnpm-workspace.yaml` (`allowBuilds`/`onlyBuiltDependencies`).
  - Vercel dashboard: set Install Command to `pnpm install` and Build Command to `pnpm run build`.

Pipeline details:
- Workflow: `.github/workflows/frontend-ci.yml`

---

## 🔧 Environment Configuration

### Frontend
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service identifier.
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template identifier.
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key.
- `PNPM_APPROVE_BUILDS`: set to `true` in Vercel to allow esbuild build scripts (pnpm security requirement). In-repo approval lives in `frontend/.npmrc` and `frontend/pnpm-workspace.yaml`.

Local development: place the three `VITE_EMAILJS_*` variables in `frontend/.env.local` (gitignored; expected keys are documented in `frontend/.env.example`). Vercel keeps the production values in the project dashboard.

---

## 🛠️ Local Development

### Quick Start
```bash
cd frontend
pnpm install
pnpm dev
```

### Quality Gates
```bash
pnpm lint     # ESLint: FSD rules + TS rules
pnpm test     # Vitest: unit + content-integrity tests
pnpm build    # TypeScript compilation + Vite production build
```

`pnpm build` also powers `pnpm preview`, which serves the production bundle locally. A Husky pre-commit hook (`.husky/pre-commit`, installed by the `prepare` script on `pnpm install`) runs `lint-staged` — ESLint over staged `*.ts`/`*.tsx` files.

---

## 🧠 Content Management

There is no CMS and no admin panel. All content is **static JSON + self-hosted images**, edited directly in the repo. Every push to `main` deploys automatically via Vercel.

### 1. Edit content

Content lives in `frontend/src/entities/<entity>/api/data.json`:

| Content | File | Notes |
|---|---|---|
| Profile | `entities/profile/api/data.json` | bilingual fields (`titleEn`/`titleEs`, …) |
| Projects | `entities/project/api/data.json` | sorted by `order` asc; `featured` flag controls the home grid |
| Skills | `entities/skill/api/data.json` | sorted by `order` asc; `level` 0–100 |
| Experience | `entities/experience/api/data.json` | sorted by `endDate DESC` (open-ended first), then `startDate DESC`; omit `endDate` for current roles |
| Spoken languages | `entities/spoken-language/api/data.json` | sorted by `order` asc |

**Add a project:** append an object to the projects array with `id` (slug), bilingual texts, `technologies`, `imageUrls`, `imageUrlsFull`, `githubUrl`/`liveUrl`, `type`, `featured`, and the next `order` value. `imageUrls` and `imageUrlsFull` must have the same length, and every referenced file must exist under `public/images/projects/<slug>/`.

**Rich text:** descriptions can store line breaks as literal `\n` sequences and lists as lines starting with `●` (also `•`, `*`, `◦`, `▪`, `-`). `src/shared/lib/richText.ts` normalizes both conventions for the UI and the generated markdown twins.

### 2. Add images

Every project image ships in **two WebP variants** under `frontend/public/images/projects/<slug>/`:
- `<name>-800.webp` — used by project cards and gallery thumbnails (`imageUrls`)
- `<name>-full.webp` — used by the fullscreen lightbox (`imageUrlsFull`)

Generate them from any source image with `sharp-cli`:

```bash
npx -y sharp-cli@5 -i source.png -o "public/images/projects/<slug>/{name}-800.webp"  resize 800 -q 82
npx -y sharp-cli@5 -i source.png -o "public/images/projects/<slug>/{name}-full.webp" -q 82
```

`npx -y` downloads and executes `sharp-cli`; run it only against your own trusted source images. Rules: WebP only, quality ~82, no external image hosts. Profile photo lives in `images/profile/`; social preview is `public/og-cover.jpg` (1200×630 JPEG, re-generate on demand).

**Cache immutability:** Vercel serves `/assets/*`, `/images/*` and `/favicon.ico` with a 1-year immutable `Cache-Control`. Vite hashes JS/CSS filenames, so they refresh on every build; image filenames do not. If you replace an image's content, **rename the file** (bump its numeric prefix, e.g. `00-` → `01-`) and update `data.json`, or returning visitors will keep the old image for up to one year. `index.html` is always revalidated, so new deployments are picked up immediately.

### 3. Verify

```bash
cd frontend
pnpm test    # data-integrity tests FAIL if any image is missing, URLs are external, the image lists mismatch, or fields/orderings break
pnpm lint
pnpm build
```

### 4. Ship

Commit and push to `main` → Vercel deploys automatically (GitHub Actions runs typecheck + lint + tests + production build as a gate).

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
