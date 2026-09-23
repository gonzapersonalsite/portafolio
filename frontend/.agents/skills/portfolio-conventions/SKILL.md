# portfolio-conventions

## Purpose

This skill documents project-specific decisions for the Portfolio application. It extends the base FSD contract (`AGENTS.md`) and the `react-fsd-maintainer` skill with choices made specifically for this codebase. Always load alongside `react-fsd-maintainer` when working on this project.

## Stack

| Category | Choice |
|---|---|
| UI Library | MUI (Material UI) |
| Routing | React Router DOM |
| State (UI) | React Context API |
| Forms | plain controlled components |
| i18n | i18next + react-i18next |
| Email | EmailJS |
| Testing | Vitest + Testing Library |
| CSS | MUI `sx` prop + Emotion + CSS co-located in `ui/` |

Versions live in `frontend/package.json`; do not duplicate them in documentation.

## Architecture (static content)

The portfolio is a **fully static frontend**. There is no backend, no HTTP client, and no server state.

- All business content lives in **static JSON files** co-located in the `api/` segment of each entity slice:
  - `entities/project/api/data.json`
  - `entities/profile/api/data.json`
  - `entities/skill/api/data.json`
  - `entities/experience/api/data.json`
  - `entities/spoken-language/api/data.json`
- The `api/` segment is the **data access layer**: the `*.ts` files in `api/` import the JSON and expose plain synchronous getters (`getAllProjects()`, `getFeaturedProjects()`, `getProfile()`, `getAllSkills()`, `getAllExperiences()`, `getAllSpokenLanguages()`).
- Content is **bilingual by design**: every text field is an En/Es pair (`titleEn`/`titleEs`). Language switch only re-renders.
- Adding/editing content = **editing JSON** (data change, not code change). No CMS, no admin panel.
- Data integrity is enforced by co-located tests (`entities/<entity>/api/data.test.ts`): they validate the field contract, ordering, and that every referenced image exists in `public/images/`.
- All images are **self-hosted** under `frontend/public/images/`. External image hosts are forbidden (enforced by data-integrity tests).

## Image Strategy

- **Format:** WebP (Baseline widely available), quality 82 for project screenshots, 85 for the profile photo. No PNG/JPEG payloads in the bundle (except `og-cover.jpg` for social crawlers, which reject WebP).
- **Two variants per project image:**
  - `<name>-800.webp` — covers and gallery thumbnails (`Project.imageUrls`)
  - `<name>-full.webp` — lightbox fullscreen view (`Project.imageUrlsFull`, optional fallback to `imageUrls`)
  - Thumbnails reuse the `-800` file, so they hit the same cache entry as the card cover.
- **Social preview:** `public/og-cover.jpg` (1200×630) referenced from `index.html` `og:image`.
- **Fallbacks:** `images/no-image.svg` (general), `profile-fallback.webp` (profile). Both local.
- **No layout shift (CLS):** every `ImageWithFallback` usage MUST pass `aspectRatio` (project covers `16/9`, profile photo `2/3`) so the container reserves space while the image loads.
- **Lazy loading:** `loading="lazy"` on all below-the-fold images (project covers, profile photo). Nothing image-like sits above the fold (LCP is the hero text), so no `fetchpriority="high"` is needed; never combine `fetchpriority` with `loading="lazy"`.
- When adding/replacing images: generate both WebP variants (e.g. `sharp resize 800` + full-size, q82), update `data.json`, and run `pnpm test` (integrity tests check every referenced file exists on disk).
- **Cache immutability:** Vercel serves `/assets/*`, `/images/*` and `/favicon.ico` immutable for 1 year (`vercel.json`). Vite hashes JS/CSS filenames, so they refresh every build; image filenames do not. When replacing an image's content, **rename the file** (bump the numeric prefix) and update `data.json`. `index.html` stays `max-age=0, must-revalidate` so deployments are picked up immediately.

## Routing

- **Library**: React Router DOM (version in `package.json`)
- **Pattern**: `React.lazy()` for all page components (code-splitting)
- **Layouts**: all pages wrapped in `PublicLayout` (Navbar + Footer + Outlet)
- **Fallback**: `<Suspense>` with page-specific skeleton loaders
- Routes: `/`, `/about`, `/skills`, `/experience`, `/projects`, `/contact`; catch-all redirects to `/`

## State Management

- **No global server state** and **no Zustand**. Content is read synchronously via the entity getters.
- **React Context** is used for cross-cutting UI state only:
  - **Theme** (`features/theme-switch/`): `light | dark | glass`. Persisted to `localStorage: themeMode`. MUI `ThemeProvider` wraps app.
  - **Language** (`features/language-switch/`): `en | es`. Persisted to `localStorage: language`. i18next `changeLanguage` on toggle.
  - **Notifications** (`features/notifications/`): MUI Snackbar + Alert for form feedback.

## Content Fetching Pattern

Pages read content synchronously through the `useContent` hook (`shared/lib/useContent.ts`):

```tsx
import { useContent } from '@/shared/lib';

const { data: projects } = useContent(() => getAllProjects());
```

### Contract

- `data: T` — always defined (content is part of the bundle)
- No `loading`, no `error`, no `refetch`: there is nothing to fetch, cache, or retry

## i18n

- **Languages**: English (`en`), Spanish (`es`)
- **Detection**: localStorage → navigator.language → fallback `en`
- **Translation files**: inline in `shared/config/i18n.ts`. UI strings only; content text lives in the JSON data (En/Es fields).
- Keep `i18n.ts` pruned: a key must be reachable from code via `t()`/`i18n.t()`; remove unused keys when touching components.
- Bilingual content fields (En/Es) are resolved with `getLocalizedText(language, en, es)` from `@/shared/lib`. Do not re-implement the En/Es fallback inline.

## Theming

- **Three modes**: `light`, `dark`, `glass` (Liquid Glass aesthetic)
- **Glass mode**: MUI dark base + glass morphism effects (backdrop-filter blur, neon colors, text shadows)
- **Theme factory**: `createAppTheme(mode)` in `shared/config/theme.ts`
- **Glass constants**: `glassColors`, `glassEffects` in `shared/config/glassStyles.ts`
- **Neon colors**: turquoise `#5DE0E6`, violet `#8A6EFF`, pink `#FF7B9C`

## Testing

- **Framework**: Vitest + @testing-library/react (versions in `package.json`)
- **Environment**: jsdom
- **Mocks**: `vi.mock` at module level, `vi.fn()` for spies
- **Conventions**: co-located tests (`*.test.ts(x)` next to source), `describe`/`it` blocks, mocks before imports
- **MUI mock**: Provides minimal stubs for MUI (`@mui/material`, `@mui/icons-material`) used during testing (aliased in `vitest.config.ts`).
- **Content integrity tests**: `entities/<entity>/api/data.test.ts` validate the static JSON (contract, ordering, images exist via `import.meta.glob`).
- **Run**: `pnpm test` (CI: `frontend-ci.yml`)
- **Local gate**: a Husky pre-commit hook (installed by the `prepare` script on `pnpm install`) runs `lint-staged` — ESLint over staged `*.ts`/`*.tsx` files.

## Build & Deploy

- **Build**: `tsc -b && vite build` with chunk splitting: `react-vendor` (react, react-dom, react-router-dom), `mui-vendor` (@mui/material, @mui/icons-material)
- **TypeScript side-by-side layout**: `typescript` is aliased to `@typescript/typescript6` — the programmatic API that typescript-eslint consumes, exposing `tsc6` — while `@typescript/native` provides the native compiler that `tsc` (and therefore `pnpm build`) resolves to. Do not collapse them into a single `typescript` dependency until typescript-eslint supports the native compiler API.
- **Dev**: Vite dev server (port 5173); no API proxy needed
- **Prod**: Vercel (root dir `frontend/`) with SPA rewrites (`vercel.json`); no `/api` proxy

## Agent-Readable Output

- `tooling/agent-files/` generates `llms.txt`, `robots.txt`, `sitemap.xml`, one English and one Spanish markdown twin per route, and one HTML shell per route (own title, description, canonical and markdown alternates).
- It runs as a Vite plugin (`vitePlugin.ts`, wired in `vite.config.ts`): `pnpm build` emits the files into `dist/`; `pnpm dev` serves them from middleware. **Nothing generated is committed to git.**
- Content comes from the entity getters and `shared/lib/richText.ts`; shell metadata mirrors `seo.*` in `shared/config/i18n.ts` and twin labels mirror UI strings. Tests enforce both parities, link integrity across generated files, and deterministic output.
- Base URL (`BASE_URL`) and the route table live in `tooling/agent-files/routes.ts`. Adding a route to the SPA router requires adding it here too; the generator and its tests then cover it.
- `src/shared/lib/richText.ts` is the single normalization ruleset shared by `RichTextRenderer` and the twins; change it only in both consumers' interest.

## Security

- **Scripts**: esbuild's build script is approved in-repo via `only-built-dependencies[]=esbuild` (`frontend/.npmrc`) and `pnpm-workspace.yaml` (`allowBuilds`/`onlyBuiltDependencies`); pnpm v11 security requirement.
- **Contact form**: EmailJS in the browser (keys are public by design); no secrets stored in the repo. The network call lives in `features/contact-form/api/contactApi.ts` and is bounded by a 15s timeout; form state and notifications live in `features/contact-form/model/useContactForm.ts`.
- No authentication surface exists in this app

## File Organization (FSD)

See `AGENTS.md` and `react-fsd-maintainer/SKILL.md` for the canonical FSD layer hierarchy and import rules.

**Template supersession (deliberate):** the HTTP/API two-layer pattern and the store examples in those template files are generic and do not apply to this repository — there is no backend and no `shared/api/`. FSD boundaries govern `src/` only; `tooling/**` is build-time code and is exempted from the `fsd-lint` rules in `eslint.config.js` on purpose. Do not remove that exemption.

## Peer Skills

- `react-fsd-maintainer`: Canonical FSD architecture rules (loaded from template, immutable)
