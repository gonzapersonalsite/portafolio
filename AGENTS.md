# Portafolio — AI Agents Context

This repository contains a **static portfolio frontend** (`frontend/`). There is no backend.

To ensure you use the correct context, rules, and skills, read the frontend rules before touching any code:
👉 `frontend/AGENTS.md` (FSD contract, immutable template)
👉 `frontend/.agents/skills/portfolio-conventions/SKILL.md` (project conventions: static content model, i18n, theming, testing)
👉 `frontend/.agents/skills/react-fsd-maintainer/SKILL.md` (canonical FSD rules)

## Quick facts

- Content lives in static JSON: `frontend/src/entities/<entity>/api/data.json` (no CMS, no API, no database).
- Images are self-hosted under `frontend/public/images/`; external image hosts are forbidden.
- Do not hardcode software versions in documentation; versions are managed by `frontend/package.json`.

## Migration history

This repo previously contained a Spring Boot backend (`backend/`), Docker Compose, and a PostgreSQL database on Aiven. They were removed in the static migration (see `docs/MIGRATION_PLAN.md`). Git history and the tag `pre-static-migration` preserve the old full-stack implementation.
