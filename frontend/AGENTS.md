# AGENTS.md — React FSD Template

## Project Identity
| Property   | Value                                            |
|------------|--------------------------------------------------|
| Stack      | React, TypeScript, Vite, ESLint (flat), pnpm — see package.json for versions |
| Architecture | Feature-Sliced Design (FSD)                     |
| Purpose    | Template: every project spawned from this MUST preserve FSD integrity across its entire lifecycle. No architectural drift allowed. |

---

## FSD Layer Hierarchy

Layers are ordered top→bottom. A layer **may only import** from layers **below** it and from `shared/`.

```
app/          ← Routing, providers, layouts, global styles, entry point
pages/        ← Full-page compositions (assemble widgets + features)
widgets/      ← Self-contained complex UI blocks (combine entities + features)
features/     ← Reusable user interactions / business logic
entities/     ← Domain models, data access, business entities
shared/       ← Zero business logic: pure utilities, UI kit, config, lib, API client
```

**Critical rule**: A slice in layer N **MUST NOT** import from another slice in layer N (same-level slices are isolated). This is enforced by `fsd-lint/no-cross-slice-dependency`.

---

## Slice Anatomy

Every slice inside a layer follows this segment convention:

```
<layer>/<slice-name>/
├── index.ts          # PUBLIC API — the only file other slices may import from
├── ui/               # React components + co-located CSS (*.css, *.module.css)
├── model/            # Types, stores (Zustand, Redux), validation schemas, DTOs
├── lib/              # Internal utilities (NOT importable from outside the slice)
├── api/              # Slice-specific API calls, endpoint definitions
└── config/           # Slice-specific constants, feature flags
```

**Do NOT create segments that stay empty.** Only add a segment folder when it contains at least one file.

---

## CSS & Styles Convention

Styles are **always co-located** with the component that uses them. There is no separate `styles/` segment or global styles folder outside `app/`.

| Style Type                  | Location                                                   | Example                                         |
|-----------------------------|------------------------------------------------------------|-------------------------------------------------|
| Component-scoped styles     | `<slice>/ui/<Component>.module.css`                        | `entities/user/ui/UserCard.module.css`          |
| Global styles (reset, vars) | `app/` — as a styles file imported by the root layout      | `app/styles/global.css`, `app/styles/variables.css` |
| Shared design tokens/vars   | `shared/ui/` — if truly reusable across all layers         | `shared/ui/variables.css`                       |

### Rules (zero tolerance)

- CSS files **MUST** live inside `ui/`, co-located next to the `.tsx` file that imports them.
- CSS files **MUST NOT** be placed in `model/`, `api/`, `lib/`, or `config/`.
- **Do NOT create a `styles/` segment** in any slice. Co-location is the convention.
- **Do NOT place CSS files at the slice root** (e.g., `entities/user/styles.css`).
- Global styles belong in `app/`, not scattered across slices.
- A component imports its own styles directly:

```tsx
// ✅ CORRECT — co-located CSS module
import styles from './UserCard.module.css'

// ✅ CORRECT — co-located plain CSS
import './UserCard.css'

// ❌ INCORRECT — CSS imported from a different segment
import styles from '../model/userStyles.module.css'

// ❌ INCORRECT — CSS placed at slice root
import styles from '../styles.css'
```

---

## Public API Contract

- Every slice **MUST** expose an `index.ts` at its root.
- Other slices **MUST** import only from that `index.ts` — never from internal files.
- No deep imports: `import { useAuth } from '@/features/auth'` is correct. `import { useAuth } from '@/features/auth/model/store'` **is forbidden**.
- The `index.ts` re-exports only what is intentionally public. Internal symbols remain locked.

Enforced by `fsd-lint/no-public-api-sidestep`.

---

## Import Rules (zero tolerance)

| Rule                                           | ESLint rule                            |
|------------------------------------------------|----------------------------------------|
| No relative imports between different slices   | `fsd-lint/no-relative-imports`         |
| No cross-layer upward imports                  | `fsd-lint/forbidden-imports`           |
| No same-layer sibling imports                  | `fsd-lint/no-cross-slice-dependency`   |
| No bypassing the public API                    | `fsd-lint/no-public-api-sidestep`      |
| No UI components in business-logic layers      | `fsd-lint/no-ui-in-business-logic`     |

**Always use the `@/` alias** (`@/` → `src/`). Every import is absolute:

```ts
// CORRECT
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth'
import { User } from '@/entities/user'

// FORBIDDEN
import { Button } from '../../shared/ui/Button'         // relative
import { useAuth } from '@/features/auth/model/store'   // sidesteps public API
import { User } from '@/entities/user/model/types'      // sidesteps public API
```

---

## API Calls Pattern

API calls have two layers, never mixed:

### Layer 1 — Shared HTTP client (`shared/api/`)

Infrastructure only. Knows nothing about the domain.

```ts
// shared/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

### Layer 2 — Slice-specific endpoints (`<slice>/api/`)

Domain-aware functions that call the shared client.

```ts
// entities/user/api/userApi.ts
import { request } from '@/shared/api'

export function fetchUserById(id: string) {
  return request<User>(`/users/${id}`)
}

// features/auth/api/authApi.ts
import { request } from '@/shared/api'

export function login(credentials: Credentials) {
  return request<Session>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}
```

### Data flow

```
Component (ui/) → Hook/Store (model/) → Slice API (api/) → Shared client (shared/api/) → Backend
```

- Slice API functions are consumed by the slice's `model/` (hooks, stores), not directly by `ui/`.
- Only the shared client and slice API files make HTTP calls. Components and hooks never call `fetch()` directly.
- The shared client is the **only** place that constructs URLs and handles headers.

---

## Where to Put Code (Decision Guide)

Ask in this order:

1. **Does it belong to a specific business entity?** → `entities/<entity-name>/`
2. **Does it implement a user interaction or business flow?** → `features/<feature-name>/`
3. **Is it a composition of entities + features forming a standalone UI block?** → `widgets/<widget-name>/`
4. **Is it a full page assembly?** → `pages/<page-name>/`
5. **Is it application-wide infrastructure (routing, providers, layout)?** → `app/`
6. **Is it totally generic — reusable across all layers without any business knowledge?** → `shared/`

When in doubt, **start in `features/` or `entities/`** and extract upward to `widgets/` only when the composition proves reusable across multiple pages.

---

## Naming Conventions

| Element           | Convention             | Example                          |
|-------------------|------------------------|----------------------------------|
| Component files   | PascalCase `.tsx`      | `UserCard.tsx`                   |
| Hook files        | camelCase, `use` prefix | `useAuth.ts`                   |
| Type files        | PascalCase `.ts`       | `User.ts`, `OrderDTO.ts`        |
| Slice folders     | kebab-case             | `user-profile/`, `order-cart/`  |
| Segment folders   | lowercase              | `ui/`, `model/`, `api/`, `lib/` |
| public API file   | `index.ts`             | `entities/user/index.ts`         |

---

## Code Quality Baseline

- TypeScript `strict: true` — no exceptions.
- `noUnusedLocals: true`, `noUnusedParameters: true` — dead code is deleted, not commented out.
- ESLint config runs all 5 FSD rules as `error`. Run `pnpm lint` before committing.
- Prettier via `eslint-config-prettier`. No standalone `.prettierrc` unless explicitly added by the user.
- No console.log in production code; use structured logging if needed.
- Errors must be meaningful: no empty catch blocks, no swallowed promises.

---

## Development Workflow

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # TypeScript compilation + Vite production build
pnpm lint       # ESLint: all FSD rules + TS rules + React hooks rules
pnpm preview    # Preview production build locally
```

**Before creating a new slice:**
1. Identify the correct layer using the decision guide above.
2. Scaffold the directory with only the required segments.
3. Create `index.ts` as the public API.
4. Implement, import only from lower layers or `shared/`.
5. Run `pnpm lint` and fix all errors before considering the work done.

---

## Anti-Architecture (What Never to Do)

- Never place a React component inside `model/`, `lib/`, `api/`, or `config/`.
- Never place a CSS file in `model/`, `lib/`, `api/`, or `config/`. CSS lives exclusively in `ui/`.
- Never create a `styles/` segment — the co-location convention requires styles next to their component in `ui/`.
- Never create an `index.ts` that re-exports everything — curate the public API intentionally.
- Never import from a sibling slice. If two slices need shared code, extract it to `shared/` or a lower layer.
- Never skip the public API with a deep import to work around an incomplete re-export.
- Never put business logic in `shared/`. If it knows about a domain entity, it belongs in `entities/`.
- Never add a new FSD layer. The 6 canonical layers (`app`, `pages`, `widgets`, `features`, `entities`, `shared`) are exhaustive. Do not invent `services/`, `stores/`, `hooks/`, etc. at the top level of `src/`.

---

## Project Conventions (created during setup, kept in a separate skill)

This file and `.agents/skills/react-fsd-maintainer/SKILL.md` define the **base FSD contract**. They are the template's foundation and **MUST NOT be modified** by any project spawned from this template.

When, during project setup, the developer makes implementation decisions (state library, routing, error strategy, testing, CI, etc.), you **MUST** create a new skill file:

```
.agents/skills/<project>-conventions/SKILL.md
```

Inside it, document **every convention as an immutable rule** that future AI agents will load and obey. Use the same imperative, non-negotiable tone as this file.

### Why a separate file

- Keeps the base FSD contract clean and auditable.
- Prevents this file from inflating with project-specific rules.
- Allows the project conventions to grow independently without touching template files.
- Future agents load both: the base skill for architecture + the conventions skill for project rules.

### Examples of what belongs in `<project>-conventions/SKILL.md`

```markdown
# <project-name> — Project Conventions

## State Management
- Zustand is the ONLY state library. Do NOT introduce Redux, Jotai,
  React Context, or useState for cross-component state.
- Store files live at: <layer>/<slice>/model/store.ts
- Stores are vanilla Zustand (create). No slices pattern.

## Routing
- react-router v7 with lazy loading is the routing standard.
- Every route uses React.lazy + Suspense at the page level.
- All routes are defined exclusively in app/router/index.tsx.
- Never define routes inside a page or widget — only in app/router/.

## Error Handling
- All user-facing errors surface via shared/ui/Toast (or <chosen-lib>).
- Never use alert() or console.error() for user-facing errors.
- Error boundaries wrap each route in app/providers/ErrorBoundary.tsx.
- API errors are caught in the slice API layer and re-thrown as typed
  AppError for the error boundary to handle.

## Testing
- Vitest + React Testing Library.
- Tests are co-located alongside the source file: <name>.test.tsx.
- Coverage threshold: 80% branches, enforced in CI.

## CI
- pnpm lint and pnpm test must pass on every PR. Failing = blocked merge.
- pnpm build must pass before merge to main.
```

### Rule

Every time a new implementation decision is made that should be respected
across the whole project, **add it to the conventions skill**. Do not
wait — do it in the same session. Future agents depend on it.

---

## Template Integrity

This file is part of the template. All projects created from this template inherit these rules. When modifying a spawned project:

- You **MAY** add slices within existing layers.
- You **MUST NOT** add new top-level directories under `src/` outside the 6 FSD layers.
- You **MUST NOT** relax or remove any `fsd-lint` rule from `eslint.config.js`.
- You **MUST NOT** bypass the public API pattern for any slice.
