# 🛠️ Operations Guide

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](LICENSE)

🇺🇸 **English** | [🇪🇸 Español](docs/es/OPERATIONS.md)

This document covers the infrastructure, deployment pipeline, environment configuration, and local development setup for the Portfolio project.

---

## ☁️ Infrastructure & Deployment

The project is **static-only** — a single deployment, zero servers.

### Cloud Provider
- **Frontend Hosting:** [Vercel](https://vercel.com) (optimized for React/Vite applications), root directory `frontend/`.

### 🚀 CI/CD Pipeline
- **Frontend (Vercel):**
  - Vercel auto-deploys on every push to `main` from the `frontend/` directory.
  - Vercel detects pnpm from `pnpm-lock.yaml`; pnpm then switches to the version pinned in the `packageManager` field of `frontend/package.json` (the build log shows which version ran).
  - GitHub Actions runs lint, tests and `pnpm build` (type-check + production build) on pushes/PRs touching `frontend/**`. It does not block the Vercel deployment: Vercel's own build (`tsc -b && vite build`) stops a deploy on type or build errors, but a lint or test failure only shows as a failed check, so run `pnpm lint && pnpm test` before pushing. The workflow runs on `ubuntu-24.04` with read-only permissions, and its actions are pinned to full commit SHAs with the release in a comment. To upgrade an action, resolve the new tag with `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` (an annotated tag points to a tag object: follow it to the commit) and replace the SHA and the comment together.
  - esbuild's install script is approved in-repo by `allowBuilds: { esbuild: true }` in `frontend/pnpm-workspace.yaml`, the build-approval setting of pnpm 11 and later; every other dependency's install script stays blocked. Vercel needs no extra configuration, and CI installs with `--ignore-scripts`. `frontend/.npmrc` (`only-built-dependencies[]=esbuild`) and the `onlyBuiltDependencies` list in `pnpm-workspace.yaml` are pnpm 10 settings that pnpm 11+ ignores: they stay only until a Vercel build log confirms that the install runs the pinned pnpm, and then both are deleted.
  - Vercel dashboard: set Install Command to `pnpm install` and Build Command to `pnpm run build`.

Pipeline details:
- Workflow: `.github/workflows/frontend-ci.yml`

### 🌐 Hosting configuration (`frontend/vercel.json`)
- **No rewrites:** every route is an HTML file of its own. Any other address, a missing asset or image included, gets `404.html` with status 404 (the app on that page sends visitors home). There is no `/favicon.ico`: pages link the icons in `/icons/`.
- **Security headers:** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` on every response. The CSP allows scripts from the site plus the theme script inlined in `index.html` (by its `sha256` hash), inline styles (Emotion), images and fonts from the site only, and network requests to EmailJS only.
  - If you edit the inline script in `index.html`, `pnpm test` fails and prints its new `'sha256-…'` value: put it in the CSP.
  - A new third-party service (analytics, fonts, embeds) needs its host in the matching CSP directive, or the browser blocks it. Vercel's preview toolbar is blocked too, on preview deployments only.
- **Cache:** `/assets/*`, `/images/*` and `/icons/*` are immutable for one year (see *Cache immutability* below); `index.html` is always revalidated.
- **Markdown twins** (`*.md`) are served with `X-Robots-Tag: noindex`: agents read them, search engines index the HTML pages.
- **After a deploy**, check with `curl -I`: `/about` and `/projects/` return 200 with their own `<title>`; `/nope` and `/assets/nope.js` return 404; `/about/index.md` carries `X-Robots-Tag: noindex`; `/icons/gonzalo-dev.svg` carries the immutable `Cache-Control`; every response carries `Content-Security-Policy`.

---

## 🔧 Environment Configuration

### Frontend
- `VITE_EMAILJS_SERVICE_ID`: EmailJS service identifier; it must start with `service_` (with any other value the form reports that contact is not configured, see `frontend/src/features/contact-form/api/contactApi.ts`).
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS template identifier.
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS public key.

Local development: place the three `VITE_EMAILJS_*` variables in `frontend/.env.local` (gitignored; expected keys are documented in `frontend/.env.example`). Vercel keeps the production values in the project dashboard. Nothing reads `VITE_API_BASE_URL` or `PNPM_APPROVE_BUILDS` any more: if they are still in the Vercel dashboard, delete them.

---

## 🛠️ Local Development

### Quick Start
```bash
cd frontend
pnpm install
pnpm dev
```

The dev server listens on `localhost` only; run `pnpm dev --host` to open it from a phone on the same network. It also serves `llms.txt`, `robots.txt`, `sitemap.xml` and the markdown twins; the per-route HTML shells (titles, canonical links, JSON-LD) and `404.html` only exist in the build output.

`pnpm install` runs only the dependency install scripts approved in `pnpm-workspace.yaml` (esbuild) and then the project's `prepare` script, which installs the Git hook below. With `pnpm install --ignore-scripts` nothing runs; `pnpm run prepare` installs the hook afterwards.

### Quality Gates
```bash
pnpm lint     # ESLint: FSD rules + TS rules
pnpm test     # Vitest: unit + content-integrity tests
pnpm build    # TypeScript compilation + Vite production build
```

`pnpm build` also powers `pnpm preview`, which serves the production bundle locally; open a route's shell at its trailing-slash address (e.g. `/about/`). A Husky pre-commit hook (`.husky/pre-commit`, installed by the `prepare` script) runs `lint-staged` — ESLint over staged `*.ts`/`*.tsx` files.

---

## 🧠 Content Management

There is no CMS and no admin panel. All content is **static JSON + self-hosted images**, edited directly in the repo. Every push to `main` deploys automatically via Vercel.

Paths in this section are relative to `frontend/`.

### 1. Edit content

Content lives in `src/entities/<entity>/api/data.json`:

| Content | File | Notes |
|---|---|---|
| Profile | `src/entities/profile/api/data.json` | bilingual fields (`subtitleEn`/`subtitleEs`, …); `alternateName` (the full legal name) only feeds the JSON-LD |
| Projects | `src/entities/project/api/data.json` | sorted by `order` asc; `featured` flag controls the home grid |
| Skills | `src/entities/skill/api/data.json` | sorted by `order` asc; `level` 0–100; `category` is one of `SKILL_CATEGORY_ORDER` (`src/entities/skill/model/categories.ts`, which also sets the order of the groups on the Skills page); a new category also needs a label in `skills.categories` (`src/shared/config/i18n.ts`, EN and ES) and in `tooling/agent-files/labels.ts` — tests enforce all three. *Core Competencies* (About page, its twin and the JSON-LD `knowsAbout`) are the Frontend, Backend, Database, Mobile and Desktop skills with `level` ≥ 70 (`getCoreSkills`) |
| Experience | `src/entities/experience/api/data.json` | sorted by `endDate DESC` (open-ended first), then `startDate DESC`; omit `endDate` for current roles; dates are `YYYY-MM-DD` and are shown as month and year (`Mar 2025 – Jun 2025`) |
| Spoken languages | `src/entities/spoken-language/api/data.json` | sorted by `order` asc |

**Add a project:** append an object to the projects array with `id` (slug), bilingual texts, `technologies`, `images`, `links`, `type`, `featured`, and the next `order` value. To place a project elsewhere, insert it at that position and renumber the `order` of the entries after it: the array must stay sorted by `order`.

- `images` is the gallery in order; the first one is the card cover. Each entry is `{ "base": "/images/projects/<slug>/<NN>-<name>", "fullWidth": <width of the -full file in px>, "altEn": "…", "altEs": "…" }`, where `<NN>` is its gallery position (`00`, `01`, …) and the alt texts describe what the screenshot shows (at most 250 characters; the gallery also shows them as captions). The tests check that the three variants exist (see below) and that `fullWidth` matches the file.
- `links` is the list of card buttons, in order: `{ "kind": "site" | "download" | "googlePlay" | "repository" | "documentation", "url": "https://…" }`. `site`, `download` and `googlePlay` are primary (filled buttons; `llms.txt` uses the first primary link); `repository` and `documentation` are secondary. Leave out a private repository rather than linking a page visitors cannot open, and say in the description that the source code is private.
- **New kind of link** (e.g. an App Store button): add it to `PROJECT_LINK_KINDS` in `src/entities/project/model/projectLinks.ts` (label key and emphasis), its label under `projects.links` in `src/shared/config/i18n.ts` (EN and ES, sentence case in Spanish), its twin label in `tooling/agent-files/labels.ts` and its icon in `LINK_ICONS` (`src/entities/project/ui/ProjectCard.tsx`). TypeScript and `labels.test.ts` fail until all four exist; the card logic does not change.

**Card description:** the card shows the first paragraph and a *Read more* button for the rest, so the first paragraph should say on its own what the project is and what it is built with.

**Rich text:** descriptions can store line breaks as literal `\n` sequences and lists as lines starting with `●` (also `•`, `*`, `◦`, `▪`, `-`). A `●`, `•`, `◦` or `▪` in the middle of a line starts a new bullet; `-` and `*` only count at the start of a line, so "Frontend - React" stays one sentence. `src/shared/lib/richText.ts` normalizes both conventions for the UI and the generated markdown twins.

**Open to work badge:** the Home hero and the Experience page, and their markdown twins, show *Open to work* / *Disponible* (`common.openToWork` in `src/shared/config/i18n.ts`, `openToWork` in `tooling/agent-files/labels.ts`). It is not a data field: to stop showing it, remove the `StatusBadge` from `src/pages/home/ui/HomePage.tsx` and `src/pages/experience/ui/ExperiencePage.tsx` and the `openToWorkLine` calls from `tooling/agent-files/twins.ts`, then update `twins.test.ts`.

**Links in Spanish:** the site has one set of URLs; add `?lang=es` (or `?lang=en`) to any page address to share it in that language, e.g. `https://mi-portafolio-gonzalo.vercel.app/about?lang=es`. The visitor's language choice is then saved as if they had picked it in the menu, and the parameter is removed from the address.

### 2. Add images

Every project image ships in **three WebP variants** (quality 82) under `public/images/projects/<slug>/`, all sharing the `base` name recorded in `data.json`:
- `<name>-thumb.webp` — 160 px wide, used by the gallery thumbnail strip
- `<name>-800.webp` — 800 px wide, used by the project card cover
- `<name>-full.webp` — original size, used by the fullscreen gallery and, on high-density screens, by the card cover (`srcset`)

Generate them with `ffmpeg` built with libwebp (nothing is downloaded), naming the output after the gallery position and the content:

```bash
cd frontend
src=path/to/capture.png                                  # your own source image
out=public/images/projects/<slug>/NN-<slug>_<description>
ffmpeg -i "$src" -vf "scale='min(160,iw)':-2:flags=lanczos" -c:v libwebp -quality 82 "$out-thumb.webp"
ffmpeg -i "$src" -vf "scale='min(800,iw)':-2:flags=lanczos" -c:v libwebp -quality 82 "$out-800.webp"
ffmpeg -i "$src" -c:v libwebp -quality 82 "$out-full.webp"
```

Never upscale: `min(…, iw)` keeps a narrower source at its own width, so a source 800 px wide or narrower gives an `-800` file the size of the `-full` one (the tests check the width of every variant against `fullWidth`). Record the width of the `-full` file as `fullWidth`.

- **Covers:** the card shows the cover at 16:9 (`PROJECT_COVER_RATIO`) and the tests require exactly that ratio in all three variants. Crop a real screenshot to its content, or extend it with rows of its own plain background when it is too short; never put browser chrome in a screenshot, and keep logos in the gallery rather than on the cover.
- **No leftovers:** the tests fail on any file under `public/images/projects/` that no project shows, so delete the old variants when you replace or remove an image.
- **Other images:** WebP only (quality 82 for screenshots, 85 for the profile photo), no external image hosts. The profile photo lives in `public/images/profile/` and its fallback is `public/profile-fallback.webp`.
- **Social preview:** `public/og-cover-typographic.jpg` (1200×630 JPEG, quality 85; social crawlers reject WebP): the GONZALO.DEV wordmark, name, role and main stack in Inter on the dark hero gradient, no photo, rendered from an HTML page in headless Edge. `index.html` links it from `og:image` and `twitter:image` by a root-relative path (the build makes it absolute) and describes it in `og:image:alt` and `twitter:image:alt`. Social platforms cache previews by URL, so a changed image gets a new file name; after the deploy, refresh the previews with LinkedIn Post Inspector and the Facebook Sharing Debugger.
- **Icons:** the GONZALO.DEV monogram in `public/icons/`: `gonzalo-dev.svg` (preferred by browsers), `gonzalo-dev.ico` (16, 32 and 48 px) and `gonzalo-dev-180.png` (apple-touch icon). A changed icon gets new file names and new links in `index.html`; `pnpm test` checks that every icon and social image `index.html` links exists.

**Cache immutability:** Vercel serves `/assets/*`, `/images/*` and `/icons/*` with a 1-year immutable `Cache-Control`. Vite hashes JS/CSS filenames, so they refresh on every build; image and icon filenames do not. If you replace an image's content, **rename the file** (keep its numeric prefix, which is the gallery position, and change the descriptive part, e.g. `02-developer-site_quotidia` → `02-developer-site_quotidia-gallery`; rename the `-thumb`, `-800` and `-full` variants together so they keep one base name) and update `base` in `data.json`, or returning visitors will keep the old image for up to one year. `index.html` is always revalidated, so new deployments are picked up immediately.

### 3. Verify

```bash
cd frontend
pnpm test    # data-integrity tests FAIL if an image variant is missing, has the wrong width or is unused, a cover is not 16:9, an alt text or link is invalid, or fields/orderings break
pnpm lint
pnpm build
```

### 4. Ship

Commit and push to `main` → Vercel deploys automatically; GitHub Actions reports lint, tests and the type-checked production build alongside it (it does not hold the deploy back).

---

## 🚫 Legal Notice

**© 2026 Gonzalo Martínez García. All rights reserved.**

This software is **proprietary** and is provided for **evaluation purposes only**.
- **Unauthorized copying**, modification, distribution, or use of this software, via any medium, is strictly prohibited.
- **Personal use for other portfolios is not allowed.**
- See the [LICENSE](LICENSE) file for full terms and conditions.

---

**Developed by Gonzalo Martínez García**
*Junior Full Stack Developer | Software Engineering & Innovation*
