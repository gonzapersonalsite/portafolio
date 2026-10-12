# AGENTS.md — Portafolio frontend

## Project Identity
| Property   | Value                                            |
|------------|--------------------------------------------------|
| Stack      | React, TypeScript, Vite, MUI, ESLint (flat), Vitest, pnpm — see package.json for versions |
| Architecture | Feature-Sliced Design (FSD), governed by `../ARCHITECTURE.md` → *Feature-Sliced Design Rules* |
| Purpose    | Static bilingual (EN/ES) portfolio of Gonzalo Martínez, the only project of the Portafolio repository (repository context and skills index: `../AGENTS.md`). |

---

## Architecture

The architecture of `src` (the six layers, slices and segments, the public API of each slice, what may import what, styles, data and network, naming) lives in one place: `../ARCHITECTURE.md` → *Feature-Sliced Design Rules*, with its Spanish mirror in `../docs/es/ARCHITECTURE.md`. Each rule there says what enforces it: `eslint.config.js`, proved case by case by `eslint.config.test.ts`, or the review of the diff.

- A change to an architecture rule changes `eslint.config.js`, its case in `eslint.config.test.ts` and its line in both architecture documents together.
- An exception to a rule is the owner's decision. It lives in `eslint.config.js` next to its reason, never in an `eslint-disable` comment: the lint reports such a comment as a warning, and `pnpm lint` fails on any warning.
- Procedures (create a slice, move code down a layer, fix an architecture finding of the lint): `.agents/skills/react-fsd-maintainer/SKILL.md`.

---

## Code Quality Baseline

- TypeScript `strict: true` — no exceptions.
- `noUnusedLocals: true`, `noUnusedParameters: true` — dead code is deleted, not commented out.
- `pnpm lint` fails on any error or warning. Run it before committing.
- Prettier via `eslint-config-prettier`. No standalone `.prettierrc` unless explicitly added by the user.
- No console.log in production code; use structured logging if needed.
- Errors must be meaningful: no empty catch blocks, no swallowed promises.
- Every test runs and asserts something: the rule and what enforces it are in `../ARCHITECTURE.md` → *Feature-Sliced Design Rules*.

---

## Development Workflow

```bash
pnpm dev        # Start dev server with HMR
pnpm lint       # ESLint: architecture rules + TS rules + React hooks rules; a warning fails it
pnpm test       # Vitest: unit, content-integrity and architecture-rule tests
pnpm build      # TypeScript compilation + Vite production build
pnpm preview    # Preview production build locally
```

---

## Project Conventions

Project-specific decisions (stack, static content model, images, project links, routing, state, i18n, theming, accessibility, test tooling and practices, build and deploy, agent-readable output, security) live in `.agents/skills/portfolio-conventions/SKILL.md`. When a new decision is made that the whole project must respect, add it there in the same change; an architecture decision goes to `../ARCHITECTURE.md` instead.
