# react-fsd-maintainer

## Purpose

This skill ensures all code written in this project adheres to **Feature-Sliced Design (FSD)** architecture. Invoke this skill:

- When creating a new feature, entity, widget, or page.
- When modifying existing code that touches multiple FSD layers.
- When reviewing code for architectural compliance.
- When the agent is unsure where to place a new piece of code.

---

## FSD Architecture — The 6 Layers

```
                  ┌─────────────────────────────────────┐
  ┌─────────────┐ │  app/                               │
  │   pages/    │ │  - App entry, routing, providers    │
  │ ┌─────────┐ │ │  - Global styles                    │
  │ │ widgets/│ │ │  - Layout components                 │
  │ │ ┌─────┐ │ │ │  - Initialization scripts           │
  │ │ │ feat.│ │ │ └─────────────────────────────────────┘
  │ │ │ ┌───┐│ │ ┌─────────────────────────────────────┐
  │ │ └─┤ent│─┘ │ │  pages/                             │
  │ │   └───┘   │ │  - Full-page compositions           │
  │ │  ┌──────┐ │ │  - Route-level responsibility       │
  │ └──┤shared│ │ │  - Minimal logic, mostly assembly    │
  │    └──────┘ │ └─────────────────────────────────────┘
  └─────────────┘ ┌─────────────────────────────────────┐
                  │  widgets/                           │
                  │  - Self-contained complex UI blocks │
                  │  - Combines entities + features     │
                  │  - Reusable across pages            │
                  │  - Example: Header, Footer, Sidebar │
                  └─────────────────────────────────────┘
                  ┌─────────────────────────────────────┐
                  │  features/                          │
                  │  - User interactions                │
                  │  - Business logic flows             │
                  │  - Form submissions, toggles, CRUD  │
                  │  - Example: auth, theme-switch, ... │
                  └─────────────────────────────────────┘
                  ┌─────────────────────────────────────┐
                  │  entities/                          │
                  │  - Domain models / data structures  │
                  │  - API types, DTOs, validation      │
                  │  - State for a single entity        │
                  │  - Example: user, product, order    │
                  └─────────────────────────────────────┘
                  ┌─────────────────────────────────────┐
                  │  shared/                            │
                  │  - Pure utilities, no domain logic  │
                  │  - UI kit: Button, Modal, Input...  │
                  │  - API client, config, lib, types   │
                  │  - If it "knows" about an entity,   │
                  │    it does NOT belong here.         │
                  └─────────────────────────────────────┘
```

### Layer Detail

| Layer      | Contains                                                                 | Must NOT contain                                       |
|------------|--------------------------------------------------------------------------|--------------------------------------------------------|
| `app`      | Providers (Theme, Router, Auth), layout wrappers, global styles, entry   | Business logic, feature-specific code                  |
| `pages`    | Route-level compositions. Thin: mostly assemble widgets + features.      | Business logic, API calls, complex state management    |
| `widgets`  | Composite UI blocks. Header, Footer, ProductList, CommentSection.        | Page-specific one-off compositions                     |
| `features` | User flows: login form, search, add-to-cart, theme toggle.               | Domain entity definitions (those go to entities)       |
| `entities` | Domain types, API DTOs, validation, entity-specific state.               | UI components (can contain entity-specific UI though)  |
| `shared`   | Button, Input, Modal, API client, date utils, type guards.               | Any knowledge of business entities or features          |

---

## Layer Decision Tree (Where Should This Code Go?)

Answer these questions **in order**. Stop at the first match.

```
1. Is it a generic UI component or utility (Button, Modal, formatDate)?
   └─ YES → shared/
   └─ NO  → Go to 2

2. Does it represent a core business concept (User, Product, Order, Invoice)?
   └─ YES → entities/<entity-name>/
   └─ NO  → Go to 3

3. Does it implement a specific user interaction or business use case?
   └─ YES → features/<feature-name>/
   └─ NO  → Go to 4

4. Does it compose multiple features + entities into a reusable UI block?
   └─ YES → widgets/<widget-name>/
   └─ NO  → Go to 5

5. Is it a full page (a route destination)?
   └─ YES → pages/<page-name>/
   └─ NO  → Go to 6

6. Is it application infrastructure (routing config, providers, root layout)?
   └─ YES → app/
   └─ NO  → Re-evaluate. Something is wrong with the classification.
```

### Concrete Examples

| Code / Concept                              | Correct Layer | Reason                                              |
|---------------------------------------------|---------------|-----------------------------------------------------|
| `Button.tsx`, `Modal.tsx`, `Input.tsx`     | `shared/ui/`  | Generic UI components, zero domain knowledge        |
| `User` interface, `UserDTO`, user validation| `entities/user/` | Core domain entity definition                      |
| Login form, `useAuth` hook, auth API call   | `features/auth/` | User interaction flow                              |
| Header with nav + user avatar + search bar  | `widgets/header/` | Composite reusable block                          |
| Home page assembling widgets               | `pages/home/` | Route-level composition                             |
| Theme provider, router config               | `app/`        | Application infrastructure                          |
| `formatCurrency`, `useDebounce`             | `shared/lib/` | Generic utilities                                   |
| API client setup (axios/fetch wrapper)      | `shared/api/` | Generic HTTP infrastructure                         |
| `UserProfileCard` (displays user data)      | `entities/user/ui/` | Entity-specific UI component                    |
| Shipping calculator widget                  | `features/checkout/` or `widgets/` | Depends on reusability                  |
| Redux/Zustand store for "user"             | `entities/user/model/` | Entity state belongs to entity layer           |
| Redux/Zustand store for "auth session"      | `features/auth/model/` | Feature state (cross-entity concept)           |

---

## Segment Anatomy (What Goes Inside Each Segment)

```
<layer>/<slice-name>/
├── index.ts          ← PUBLIC API. Only file importable from outside.
├── ui/               ← React components + co-located styles (*.css, *.module.css)
│   ├── Component.tsx
│   └── Component.module.css
├── model/            ← Types, interfaces, DTOs, validation (Zod/Yup), stores
│   ├── types.ts
│   ├── store.ts          ← Zustand slice / Redux slice
│   └── validation.ts     ← Zod schemas
├── lib/              ← Pure functions, helpers, hooks — INTERNAL to the slice
│   └── helpers.ts
├── api/              ← API calls, endpoint definitions, fetch functions
│   └── userApi.ts
└── config/           ← Constants, enums, feature flags for this slice
    └── constants.ts
```

### Segment Rules
- `ui/` always contains `.tsx` or `.jsx` files **and** their co-located `.css` / `.module.css` files. Never put business logic here.
- `model/` contains `.ts` only. Never `.tsx`, never `.css`. It defines types, DTOs, validation, stores.
- `lib/` is slice-private. Its symbols are NOT re-exported via `index.ts` unless intentionally public. Never `.css` here.
- `api/` contains API functions. These are consumed by the slice's UI or model. Never `.css` here.
- `config/` contains constants. Do NOT put components, hooks, or styles here.
- Only create segments that have content. Empty folders are noise.

### CSS & Styles — Co-location Convention

Styles are **never** separated from their component. Every `.css` or `.module.css` lives in the same `ui/` directory as the `.tsx` that imports it.

```tsx
// ✅ CORRECT — co-located CSS module in ui/ next to the component
import styles from './UserCard.module.css'
import './UserCard.css'

// ❌ INCORRECT — CSS imported from another segment
import styles from '../model/styles.module.css'
import styles from '../lib/userStyles.css'

// ❌ INCORRECT — CSS at slice root (not inside any segment)
import styles from '../user.css'

// ❌ INCORRECT — a separate styles/ segment was created
import styles from '../styles/UserCard.module.css'
```

| CSS placement           | Allowed? | Rule                                     |
|-------------------------|----------|------------------------------------------|
| `<slice>/ui/*.css`      | ✅ Yes   | Co-located with its component            |
| `<slice>/ui/*.module.css` | ✅ Yes | Co-located CSS module                    |
| `<slice>/model/*.css`   | ❌ Never | CSS goes only in `ui/`                   |
| `<slice>/lib/*.css`     | ❌ Never | CSS goes only in `ui/`                   |
| `<slice>/api/*.css`     | ❌ Never | CSS goes only in `ui/`                   |
| `<slice>/config/*.css`  | ❌ Never | CSS goes only in `ui/`                   |
| `<slice>/styles/`       | ❌ Never | Do NOT create a `styles/` segment        |
| `<slice>/styles.css`    | ❌ Never | No CSS at slice root                     |
| `app/styles/global.css` | ✅ Yes   | Global styles belong in `app/`           |
| `shared/ui/variables.css` | ✅ Yes | Shared design tokens in `shared/ui/`    |

---

## API Calls Pattern — Two Layers, Never Mixed

API communication uses a strict two-layer pattern. Each layer has a single responsibility.

### Layer 1 — Shared Client (`shared/api/`)

Pure infrastructure. Zero domain knowledge. This is the **only** place that touches `fetch()` / `axios`, constructs URLs, or manages headers.

```ts
// shared/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL

export async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json() as T
}
```

Optionally expose via `shared/api/index.ts`:

```ts
// shared/api/index.ts
export { request } from './client'
export type { ApiError } from './types'
```

### Layer 2 — Slice-Specific Endpoints (`<slice>/api/`)

Domain-aware functions that **call the shared client**. Every slice defines its own API calls.

```ts
// entities/user/api/userApi.ts
import { request } from '@/shared/api'
import type { User, CreateUserDTO, UpdateUserDTO } from '../model/types'

export function fetchUsers() {
  return request<User[]>('/users')
}

export function fetchUserById(id: string) {
  return request<User>(`/users/${id}`)
}

export function createUser(data: CreateUserDTO) {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateUser(id: string, data: UpdateUserDTO) {
  return request<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
```

```ts
// features/auth/api/authApi.ts
import { request } from '@/shared/api'
import type { Credentials, Session } from '../model/types'

export function login(credentials: Credentials) {
  return request<Session>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function logout() {
  return request<void>('/auth/logout', { method: 'POST' })
}
```

### Data Flow (Who Consumes What)

```
┌─ Component (ui/) ──────────────────────────────────┐
│  UserCard onClick={() => doLogin(creds)}            │
└──────────────────────┬──────────────────────────────┘
                       │ calls hook/store
┌──────────────────────▼──────────────────────────────┐
│  Hook / Store (model/)                              │
│  useLogin() {                                       │
│    const doLogin = async (creds) => {               │
│      const session = await login(creds) // ◄── api  │
│      setSession(session)                            │
│    }                                                │
│  }                                                  │
└──────────────────────┬──────────────────────────────┘
                       │ calls slice API
┌──────────────────────▼──────────────────────────────┐
│  Slice API (features/auth/api/authApi.ts)           │
│  export async function login(creds: Credentials) {  │
│    return request<Session>('/auth/login', { ... })   │
│  }                    │                             │
└───────────────────────┼─────────────────────────────┘
                        │ calls shared client
┌───────────────────────▼─────────────────────────────┐
│  Shared Client (shared/api/client.ts)               │
│  export async function request<T>(endpoint, opts) { │
│    const res = await fetch(`${BASE_URL}${endpoint}`) │
│    return res.json()                                │
│  }                                                  │
└─────────────────────────────────────────────────────┘
```

### Rules (Zero Tolerance)

| Rule                                                          | Enforcement                                    |
|---------------------------------------------------------------|------------------------------------------------|
| Only `shared/api/` and `<slice>/api/` call `fetch()` / axios  | Convention + code review                       |
| Components and hooks NEVER call `fetch()` directly            | Convention: if you see `fetch()` outside api/, flag it |
| Slice API is consumed by its own `model/`, not by `ui/`       | Convention: UI imports from model, not api     |
| Shared client has zero domain knowledge                       | If it imports from `entities/` or `features/`, it's broken |
| Slice API functions are internal; exported via `index.ts` only if needed | Public API pattern                             |

### Anti-Pattern: API Call Inside a Component

```tsx
// ❌ INCORRECT — component calls fetch directly
function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    fetch(`/api/users/${id}`).then(r => r.json()).then(setUser)
  }, [id])
  return <div>{user?.name}</div>
}
```

```tsx
// ✅ CORRECT — component calls hook, hook calls API
function UserProfile({ id }: { id: string }) {
  const { user } = useUser(id) // hook in model/
  return <div>{user?.name}</div>
}
```

### Anti-Pattern: Domain Logic in Shared Client

```ts
// ❌ INCORRECT — shared client knows about User domain
import type { User } from '@/entities/user' // NEVER in shared/
export function fetchUser(id: string) {
  return request<User>(`/users/${id}`)
}
```

```ts
// ✅ CORRECT — shared client is generic; domain lives in entity slice
// shared/api/client.ts — generic request<T> function, no domain imports
// entities/user/api/userApi.ts — calls request<User>(...), domain-aware
```

---

## Public API Pattern — The `index.ts` Contract

### DO: Curated, intentional re-exports

```ts
// entities/user/index.ts
export { UserCard } from './ui/UserCard'
export type { User, UserDTO } from './model/types'
export { useUserStore } from './model/store'
export { fetchUserById } from './api/userApi'
// NOTE: helpers.ts is NOT exported — it's internal
```

### DON'T: Blind re-exports or missing exports

```ts
// ❌ BAD: Exports everything indiscriminately
export * from './ui/index'
export * from './model/types'
export * from './lib/helpers'

// ❌ BAD: Forgot to export something other slices need
export { UserCard } from './ui/UserCard'
// Missing: User type, fetchUserById...
```

### Public API Audit Checklist
- [ ] Does it export only what other slices genuinely need?
- [ ] Are internal helpers/hooks kept private?
- [ ] Are types needed by consumers exported?
- [ ] Is there any deep import (`/model/store`) elsewhere in the codebase that should use this export instead?

---

## Import Patterns — Correct vs Incorrect

### Correct: Absolute imports via selected entities only

```ts
// ✅ CORRECT
import { Button } from '@/shared/ui'
import { UserCard, useUserStore } from '@/entities/user'
import { useAuth, LoginForm } from '@/features/auth'
import { Header } from '@/widgets/header'
```

### Incorrect: Relative imports between slices

```ts
// ❌ INCORRECT
import { Button } from '../../shared/ui/Button'
import { UserCard } from '../entities/user/ui/UserCard'
```

### Incorrect: Deep imports bypassing public API

```ts
// ❌ INCORRECT — sidesteps public API
import { useAuth } from '@/features/auth/model/store'
import type { User } from '@/entities/user/model/types'
```

### Incorrect: Cross-slice sibling import

```ts
// ❌ INCORRECT — 'auth' importing from 'theme' (both in features/)
import { useTheme } from '@/features/theme'
// Both are in features/ → same layer → forbidden by no-cross-slice-dependency
```

---

## Common Patterns & Anti-Patterns

### Pattern: Extracting Shared Code

**Scenario**: Both `features/auth` and `features/profile` need `isValidEmail()`.

**WRONG**: `features/auth` imports from `features/profile` (cross-slice).
**WRONG**: Duplicate `isValidEmail()` in both places.

**RIGHT**: Extract `isValidEmail()` to `shared/lib/validation.ts` and import from there:

```ts
// shared/lib/validation.ts
export function isValidEmail(email: string): boolean { /* ... */ }

// features/auth/ui/LoginForm.tsx
import { isValidEmail } from '@/shared/lib'
```

### Pattern: Entity with UI

Entities CAN have UI if it's entity-specific display logic:

```ts
// entities/user/ui/UserAvatar.tsx — OK: displays user data, entity-specific
export function UserAvatar({ user }: { user: User }) {
  return <img src={user.avatarUrl} alt={user.name} />
}

// shared/ui/Avatar.tsx — ALSO OK: generic avatar, no User knowledge
export function Avatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} />
}
```

### Pattern: Feature Using an Entity

```ts
// features/auth/ui/LoginForm.tsx
import { User, fetchUserByEmail } from '@/entities/user'
import { Button, Input } from '@/shared/ui'
// ✅ Valid: feature imports from entity (lower layer) and shared
```

### Anti-Pattern: Entity Importing a Feature

```ts
// ❌ INCORRECT — entity must NOT import from feature (upper layer)
import { useAuth } from '@/features/auth'
```

### Anti-Pattern: Shared Importing from Entity

```ts
// ❌ INCORRECT — shared must NOT know about any entity
import type { User } from '@/entities/user'
```

---

## New Slice Creation Checklist

When creating a new slice (e.g., `features/checkout/`):

1. **[ ] Layer decision**: Apply the decision tree. Are you sure this is `features/` and not `entities/` or `widgets/`?

2. **[ ] Directory scaffold**: Create only necessary segments.
   ```bash
   src/features/checkout/
   ├── index.ts
   ├── ui/
   ├── model/
   └── api/
   ```

3. **[ ] Public API first**: Write `index.ts` BEFORE implementing internals. Define what the outside world should see.

4. **[ ] Implement segments**: Fill each segment with its code. Components in `ui/`, types in `model/`, API calls in `api/`.

5. **[ ] Verify imports**: Every import within the new slice must point to:
   - `shared/` (always allowed)
   - A lower layer via its public API (`@/entities/...`, `@/features/...`, etc.)
   - Internal files within the same slice (relative imports within the slice are OK)

6. **[ ] Lint check**: `pnpm lint`. Fix ALL errors. FSD rules are `error` level — they cannot be ignored.

7. **[ ] Dead code audit**: No commented-out code, no unused exports in `index.ts`, no empty segments.

---

## FSD Lint Rules — What Each One Enforces

| Rule                               | What it catches                                           | Typical violation                                     |
|------------------------------------|-----------------------------------------------------------|------------------------------------------------------|
| `no-relative-imports`             | `../../shared/ui/Button`                                  | Using `..` between slices                            |
| `forbidden-imports`               | `pages/` importing from `app/` (upward)                   | Reversed dependency direction                        |
| `no-cross-slice-dependency`       | `features/auth` importing from `features/theme`           | Same-layer slice coupling                            |
| `no-public-api-sidestep`          | Deep import: `@/features/auth/model/store`                | Bypassing `index.ts`                                 |
| `no-ui-in-business-logic`         | `.tsx` file in `entities/user/model/`                     | Component in non-UI segment                          |

These rules are configured with `severity: 'error'` in `eslint.config.js`. They are the primary enforcement mechanism for FSD. When any rule fires, the code MUST be restructured to comply.

---

## Integration with Project Tooling

- **Path alias**: `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **ESLint**: All FSD rules active. Run `pnpm lint` to verify.
- **TypeScript**: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- **Formatting**: `eslint-config-prettier` handles formatting conflicts. No standalone `.prettierrc`.

---

## Quick Reference Card

```
Need to add code? Ask:                     Import rule:
                                           ┌──────────────────────────────
  Generic UI/Util?   → shared/            │
  Business entity?   → entities/          │  ── app
  User interaction?  → features/          │    └── pages
  Composite block?   → widgets/           │        └── widgets
  Full page?         → pages/             │            └── features
  App infrastructure?→ app/               │                └── entities
                                           │                    └── shared ◄── always allowed
  Import path: @/<layer>/<slice>          │
  Sibling slice?     → NEVER              │  One-way. No cycles. No shortcuts.
  Deep import?       → NEVER              └──────────────────────────────
  Relative path?     → NEVER (between slices)

  Public API:        <slice>/index.ts
  Only file importable from outside.
  Curated exports. Not a dump of everything.
```
