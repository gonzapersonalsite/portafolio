# SKILL: Monorepo Router

## Context
This repository is a monorepo consisting of distinct, separate projects:
- `frontend/` (Frontend project, e.g. React/TypeScript)
- `backend/` (Backend project, e.g. Spring Boot Hexagonal Architecture)

## Mandatory Routing Rules for AI Agents
When you are asked to work on this repository, you MUST determine which part of the stack you are touching and load its specific context before generating or analyzing any code:

1. **If working on the BACKEND:**
   - You MUST immediately read `backend/AGENTS.md`.
   - You MUST comply with all skills defined in `backend/.agents/skills/`.

2. **If working on the FRONTEND:**
   - You MUST immediately read `frontend/AGENTS.md` (if it exists) or check `frontend/.agents/skills/`.
   - You MUST comply with all frontend-specific conventions.

3. **General Versioning Rule:**
   - NEVER assume frontend rules apply to the backend, or vice versa.
   - DO NOT hardcode software versions in documentation, `.md` files, or rules (e.g., do not say "Java 21", "Spring Boot 3.2.0", "LTS", or "Node 20"). Versions are strictly managed by their respective dependency files (`build.gradle`, `package.json`, etc.). Read those files to verify current versions.
