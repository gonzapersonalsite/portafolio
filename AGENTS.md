# Portafolio — AI Agents Context

This repository contains a **static portfolio frontend** (`frontend/`). There is no backend.

To ensure you use the correct context, rules, and skills, read the frontend rules before touching any code:
👉 `frontend/AGENTS.md` (FSD contract, immutable template)
👉 `frontend/.agents/skills/portfolio-conventions/SKILL.md` (project conventions: static content model, images, project links, i18n, theming, accessibility, testing, build and security)
👉 `frontend/.agents/skills/react-fsd-maintainer/SKILL.md` (canonical FSD rules)

## Quick facts

- Content lives in static JSON: `frontend/src/entities/<entity>/api/data.json` (no CMS, no API, no database). The content workflow (projects, images, links, badges) is described in `OPERATIONS.md` → *Content Management*.
- Images, icons and fonts are served from the site itself (content images under `frontend/public/images/`, icons under `frontend/public/icons/`, the Inter font bundled from `@fontsource-variable/inter`); external image and font hosts are forbidden.
- `llms.txt`, `sitemap.xml`, the markdown twins and the per-route HTML shells are generated at build time; never commit them.
- Do not hardcode software versions in documentation; versions are managed by `frontend/package.json`.
- Keep the English docs and their Spanish mirrors in `docs/es/` parallel.

## Migration history

This repo previously contained a Spring Boot backend (`backend/`), Docker Compose, and a PostgreSQL database on Aiven. They were removed in the static migration (see `docs/MIGRATION_PLAN.md`, which also lists the external shutdown steps still open). Git history and the tag `pre-static-migration` preserve the old full-stack implementation.
