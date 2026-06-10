# portfolio-conventions

## Purpose

This skill documents project-specific decisions for the Portfolio application. It extends the base FSD contract (`AGENTS.md`) and the `react-fsd-maintainer` skill with choices made specifically for this codebase. Always load alongside `react-fsd-maintainer` when working on this project.

## Stack

| Category | Choice | Version |
|---|---|---|
| UI Library | MUI (Material UI) | v7 |
| Routing | React Router DOM | v7 |
| State (server) | Zustand | v5 |
| State (UI) | React Context API | — |
| Forms | react-hook-form | v7 |
| HTTP Client | Axios (custom adapter) | v1 |
| i18n | i18next + react-i18next | latest |
| Email | EmailJS | v4 |
| Testing | Vitest + Testing Library | latest |
| CSS | MUI `sx` prop + Emotion + CSS co-located in `ui/` | — |

## Routing

- **Library**: React Router DOM v7
- **Pattern**: `React.lazy()` for all page components (code-splitting)
- **Protected routes**: `ProtectedRoute` component in `features/auth/` checks `useAuthStore().isAuthenticated`
- **Layouts**: Public pages wrapped in `PublicLayout` (Navbar + Footer + Outlet); Admin pages wrapped in `DashboardLayout` (AppBar + Drawer + Outlet)
- **Fallback**: `<Suspense>` with page-specific skeleton loaders

## State Management

### Zustand

- **Auth store** (`entities/user/model/store.ts`): `token`, `username`, `isAuthenticated`, `login`, `logout`, `validateToken`
- **Persist**: `zustand/middleware/persist` with `localStorage` key `auth-storage`. Partialize: only token, username, isAuthenticated.
- **Usage**: `useAuthStore.getState().token` for JWT in API interceptor; `useAuthStore(state => state.isAuthenticated)` in components

### React Context

- **Theme** (`features/theme-switch/`): `light | dark | glass` modes. Persisted to `localStorage: themeMode`. MUI `ThemeProvider` wraps app.
- **Language** (`features/language-switch/`): `en | es`. Persisted to `localStorage: language`. i18next changeLanguage on toggle.
- **Notifications** (`features/notifications/`): MUI Snackbar + Alert. Pub/sub via `notificationEvents` for external triggers (apiClient).

## HTTP Client (`shared/api/`)

- **Base**: Axios instance with `baseURL: '/api'` (relative, proxied via Vite dev / Vercel prod)
- **Custom adapter**: Cache (localStorage, 24h TTL), request deduplication, retry with exponential backoff (max 2), cold-start notification
- **Interceptors**: 
  - Request: attach JWT token from `useAuthStore`, attach `Accept-Language` from i18n
  - Response: 401 auto-redirect to `/admin/login` (admin routes only)
- **Cache invalidation**: Any non-GET request to non-public URLs clears entire cache
- **Architecture**: Infra in `shared/api/client.ts`, auth interceptor in `app/api/interceptors.ts`

## i18n

- **Languages**: English (`en`), Spanish (`es`)
- **Detection**: localStorage → navigator.language → fallback `en`
- **Translation files**: Inline in `shared/config/i18n.ts`
- **Cache key pattern**: All cache keys include `lang` parameter: `/public/skills?&lang=${i18n.language}`

## Data Fetching Pattern

All public pages follow the same pattern (established after fixing infinite re-render bug):

```tsx
const cacheKey = `/public/<resource>?&lang=${i18n.language}`;
const cached = requestCache.get<T>(cacheKey);
const fetchedRef = useRef(!!cached);
const [data, setData] = useState<T>(cached || fallback);
const [loading, setLoading] = useState(!cached);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let cancelled = false;
  const hadCache = fetchedRef.current;
  (async () => {
    try {
      if (!hadCache) setLoading(true);
      const fresh = await api.fetch();
      if (!cancelled) { setData(fresh); setLoading(false); fetchedRef.current = true; }
    } catch (err) {
      if (!cancelled) { setError('...'); setLoading(false); }
    }
  })();
  return () => { cancelled = true; };
}, [language]);

const refetch = useCallback(async () => { /* force-refresh logic */ }, []);
```

- `fetchedRef` starts as `useRef(!!cached)` and is updated to `true` after first successful fetch
- Never updated during render (React 19 `react-hooks/refs` lint rule)
- `useEffect` depends only on `[language]` for re-fetch on language change
- `cancelled` flag prevents state updates on unmounted components
- `refetch` is a stable `useCallback([])` for error retry buttons

## Forms

- **Library**: react-hook-form v7
- **Admin CRUD dialogs**: `SkillFormDialog`, `ExperienceFormDialog`, `ProjectFormDialog`, `SpokenLanguageFormDialog`
- **Auth forms**: Login, ForgotPassword, ResetPassword pages
- **Sanitization**: `parseUrlStringToArray` (multiline text → clean URL array), `parseCommaSeparatedString` (CSV → array)

## Theming

- **Three modes**: `light`, `dark`, `glass` (Liquid Glass aesthetic)
- **Glass mode**: MUI dark base + glass morphism effects (backdrop-filter blur, neon colors, text shadows)
- **Theme factory**: `createAppTheme(mode)` in `shared/config/theme.ts`
- **Glass constants**: `glassColors`, `glassEffects`, `glassAnimations` in `shared/config/glassStyles.ts`
- **Neon colors**: turquoise `#5DE0E6`, violet `#8A6EFF`, pink `#FF7B9C`

## Testing

- **Framework**: Vitest v4 + @testing-library/react v16
- **Environment**: jsdom
- **Mocks**: `vi.mock` at module level, `vi.fn()` for spies
- **Conventions**: co-located tests (`*.test.ts` next to source), `describe`/`it` blocks, mocks before imports
- **MUI mock**: Aliased in `vitest.config.ts` to `src/__tests__/__mocks__/mui.ts` (MUI v7 subpath resolution bug)
- **Run**: `pnpm test` (CI: `frontend-ci.yml`)

## Build & Deploy

- **Build**: `tsc -b && vite build` with chunk splitting: `react-vendor` (react, react-dom, react-router-dom), `mui-vendor` (@mui/material, @mui/icons-material)
- **Dev**: Vite dev server (port 5173) with proxy `/api` → `localhost:8080`
- **Prod**: Vercel with SPA rewrites + API proxy `/api/(.*)` → Render backend
- **Docker**: Multi-stage (Node build → Nginx Alpine serve), docker-compose for local dev

## Security

- **Auth**: JWT bearer token in Authorization header
- **Scripts**: `.npmrc` with `ignore-scripts=true`, `pnpm-workspace.yaml` with `onlyBuiltDependencies: [esbuild]`
- **Input**: Sanitization in form dialogs + backend (Spring Security, XSS prevention)

## File Organization (FSD Migration Target)

See `AGENTS.md` and `react-fsd-maintainer/SKILL.md` for the canonical FSD layer hierarchy. This project is being migrated to FSD. During migration, all code moves from the legacy `src/components/`, `src/context/`, `src/services/`, etc. structure into the 6 FSD layers.

## Peer Skills

- `react-fsd-maintainer`: Canonical FSD architecture rules (loaded from template, immutable)
