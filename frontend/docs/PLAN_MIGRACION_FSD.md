# Plan de Migración FSD — Portafolio Frontend

**Versión**: 1.1  
**Fecha**: 2026-06-10  
**Rama**: `main` — trabajo local, sin operaciones git automáticas. Los commits y push los hace el desarrollador manualmente.  
**Template origen**: `templates/frontend/react-fsd-template`

---

## Resumen Ejecutivo

Migración completa del frontend de portafolio (React 19, MUI, Zustand, i18next, React Router, Axios) a la arquitectura **Feature-Sliced Design (FSD)** usando como base la plantilla `react-fsd-template`.

La migración es estructural: se reorganizan ~59 archivos fuente (~7100 líneas) en las 6 capas canónicas FSD, se adoptan las 5 reglas `eslint-plugin-fsd-lint` a nivel `error`, y se actualiza el tooling a TypeScript 6, Vite 8, ESLint 10.

**No se modifica funcionalidad.** El stack de producción (MUI, Zustand, i18next, React Router, Axios, react-hook-form, EmailJS) se conserva íntegramente. Solo cambia la organización del código y los imports.

---

## Índice

1. [Fase 0 — Preparación](#fase-0--preparación)
2. [Fase 1 — Tooling y configuración base](#fase-1--tooling-y-configuración-base)
3. [Fase 2 — Capa `shared/`](#fase-2--capa-shared)
4. [Fase 3 — Capa `entities/`](#fase-3--capa-entities)
5. [Fase 4 — Capa `features/`](#fase-4--capa-features)
6. [Fase 5 — Capa `widgets/`](#fase-5--capa-widgets)
7. [Fase 6 — Capa `pages/`](#fase-6--capa-pages)
8. [Fase 7 — Capa `app/` + Entry Point](#fase-7--capa-app--entry-point)
9. [Fase 8 — Limpieza, verificación y testing](#fase-8--limpieza-verificación-y-testing)
10. [Anexo A — Reglas FSD activas](#anexo-a--reglas-fsd-activas)
11. [Anexo B — Mapa de dependencias](#anexo-b--mapa-de-dependencias)
12. [Anexo C — Riesgos y mitigaciones](#anexo-c--riesgos-y-mitigaciones)

---

## Fase 0 — Preparación

### Objetivo
Asegurar baseline funcional antes de iniciar la migración.

### Precondiciones (ya realizadas)
- `vercel.json`: ya tiene el proxy rewrite `/api/(.*)` → Render. Se conserva tal cual.
- `apiClient.ts`: ya usa `baseURL: '/api'` (ruta relativa). Se conserva y se refactoriza en Fase 2.
- `.npmrc` con `ignore-scripts=true` operativo.
- `pnpm-workspace.yaml` con `onlyBuiltDependencies: [esbuild]` operativo.

### Acciones
1. Verificar que `docker compose up` funcione correctamente (baseline).
2. Verificar que los tests existen y pasan: `pnpm test` (ver Anexo D).

### Verificación
- [ ] `docker compose up` — navegación completa sin errores.
- [ ] `pnpm test` — todos los tests en verde (baseline pre-migración).
- [ ] Este documento existe en `frontend/docs/PLAN_MIGRACION_FSD.md`.

---

## Fase 1 — Tooling y configuración base

### Objetivo
Reemplazar toda la configuración de tooling (package.json, TypeScript, Vite, ESLint) con la de la plantilla, añadiendo las dependencias de producción del portafolio. El `src/` queda con estructura FSD vacía (capas creadas, sin código).

### 1.1 package.json

Partir del `package.json` de la plantilla. Resultado final:

```json
{
  "name": "frontend",
  "description": "Portafolio Profesional Full Stack. PROPRIETARY SOFTWARE. © 2026 Gonzalo Martínez García. ALL RIGHTS RESERVED.",
  "private": true,
  "version": "0.0.0",
  "license": "UNLICENSED",
  "packageManager": "pnpm@11.5.2",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.11",
    "@mui/lab": "^7.0.1-beta.25",
    "@mui/material": "^7.3.11",
    "axios": "^1.17.0",
    "i18next": "^25.10.10",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-hook-form": "^7.78.0",
    "react-i18next": "^16.6.6",
    "react-router-dom": "^7.17.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-fsd-lint": "^1.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
}
```

Cambios respecto a la plantilla:
- `dependencies`: se añaden MUI, Emotion, React Router, Zustand, i18next, Axios, react-hook-form, EmailJS.
- `devDependencies`: se usan exactamente las versiones de la plantilla.
- Se conservan metadatos del portafolio (`name`, `description`, `license`, `packageManager`).

### 1.2 TypeScript

Reemplazar los 3 tsconfig con los de la plantilla y consolidar configuración del portafolio:

**`tsconfig.json`** (usa el de la plantilla — incluye compilerOptions + `references`):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**`tsconfig.app.json`** — igual que el anterior más:

```json
{
  "compilerOptions": {
    "...hereda de tsconfig.json",
    "moduleDetection": "force"
  },
  "include": ["src"]
}
```

**`tsconfig.node.json`** (idéntico al de la plantilla):

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "module": "esnext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

**IMPORTANTE**: Se eliminan todos los path aliases del portafolio excepto `@/*`. Los antiguos (`@components/*`, `@pages/*`, etc.) desaparecen. Todo se importa vía `@/`.

### 1.3 Vite

Partir de `vite.config.ts` de la plantilla y añadir configuraciones de build/server del portafolio:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  }
})
```

### 1.4 ESLint

Usar exactamente `eslint.config.js` de la plantilla (con las 5 reglas FSD a `error`):

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import fsdPlugin from 'eslint-plugin-fsd-lint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'fsd-lint': fsdPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'fsd-lint/forbidden-imports': 'error',
      'fsd-lint/no-relative-imports': 'error',
      'fsd-lint/no-public-api-sidestep': 'error',
      'fsd-lint/no-cross-slice-dependency': 'error',
      'fsd-lint/no-ui-in-business-logic': 'error',
    },
  },
  prettierConfig,
);
```

### 1.5 Otros archivos a conservar/modificar

| Archivo | Acción |
|---|---|
| `pnpm-workspace.yaml` | Conservar del portafolio (`onlyBuiltDependencies: [esbuild]`) |
| `.npmrc` | Conservar del portafolio (`ignore-scripts=true`) |
| `index.html` | Conservar del portafolio (tiene SEO, OG tags, título custom) — solo actualizar `<script src="/src/main.tsx">` |
| `pnpm-lock.yaml` | Eliminar. Se regenera con `pnpm install` |
| `AGENTS.md` | Copiar de la plantilla (13 KB). Define el contrato base FSD: stack, jerarquía de capas, anatomía de slices, reglas de imports, convenciones CSS, nombrado. **Inmutable — no modificar.** |
| `.agents/skills/react-fsd-maintainer/` | Copiar de la plantilla (25 KB). Guía técnica detallada para agentes AI: árbol de decisión, 21 ejemplos, 6 anti-patrones, checklist de 7 pasos para crear slices, 5 reglas ESLint. **Inmutable — no modificar.** |
| `.agents/skills/portfolio-conventions/` | **Nuevo** — creado específicamente para este proyecto. Documenta decisiones propias: React Router v7, Zustand, MUI v7, i18next, Axios custom, Vitest, Vercel, data fetching pattern, theming glass, seguridad. Ver `.agents/skills/portfolio-conventions/SKILL.md`. |

**Flujo de herencia entre skills**:
```
AGENTS.md (contrato base, inmutable)
  └─> react-fsd-maintainer/SKILL.md (guía FSD canónica, inmutable)
        └─> portfolio-conventions/SKILL.md (decisiones específicas del portafolio)
```
Los agentes AI cargan los 3 archivos al inicio de cada sesión, garantizando consistencia arquitectónica.
| `public/` | Consolidar: `favicon.svg` (plantilla), `profile-fallback.jpg` (portafolio), `vite.svg` (cualquiera) |
| `vercel.json` | Conservar del portafolio |
| `Dockerfile` | Conservar del portafolio |
| `Dockerfile.dev` | Conservar del portafolio |
| `nginx.conf` | Conservar del portafolio |
| `.dockerignore` | Conservar del portafolio |
| `src/` | Vaciar completamente. Crear estructura FSD (6 capas + segmentos `shared/`). Sin código aún. |

### Verificación
- [ ] `pnpm install` ejecuta sin errores.
- [ ] `pnpm run lint` pasa (directorio `src/` vacío o con estructura sin archivos).
- [ ] `pnpm run build` falla esperadamente (no hay `main.tsx` aún) — confirma que tooling funciona.
- [ ] Estructura de `src/`:
  ```
  src/
  ├── app/
  ├── pages/
  ├── widgets/
  ├── features/
  ├── entities/
  └── shared/
      ├── api/
      ├── config/
      ├── lib/
      └── ui/
  ```

---

## Fase 2 — Capa `shared/`

### Objetivo
Migrar toda la infraestructura compartida: cliente HTTP, utilidades puras, configuración, kit de UI genérico. **shared/ no puede importar de ninguna otra capa.**

### 2.1 `shared/api/` — Cliente HTTP

**Origen**: `services/apiClient.ts` (183 líneas)

El archivo actual mezcla infraestructura pura (Axios, caché, reintentos) con concerns de dominio (auth token, i18n, 401 redirect). Hay que dividirlo.

#### `shared/api/client.ts` — Infraestructura pura

Contiene:
- Creación de instancia Axios (`baseURL`, `timeout`, headers base)
- Custom adapter (`cacheAdapter`): caché, deduplicación, reintentos con backoff, cold-start notification
- **NO incluye** interceptors de auth ni i18n
- Exporta la instancia `apiClient` como named export
- Importa solo de `@/shared/lib/requestCache` y `@/shared/lib/notificationEvents`

**Adaptaciones necesarias**:
1. Eliminar imports de `useAuthStore` y `i18n`
2. Eliminar el interceptor de request (JWT + Accept-Language) → se mueve a Fase 7 (`app/api/interceptors.ts`)
3. Eliminar el interceptor de response (401 redirect) → se mueve a Fase 7
4. Eliminar `const lang = headers?.['Accept-Language'] || i18n.language;` → el header vendrá ya seteado por el interceptor
5. Simplificar cache key a solo `url + params` (el idioma ya no se determina aquí)

#### `shared/api/index.ts` (API pública)
```ts
export { apiClient } from './client';
```

### 2.2 `shared/config/`

| Origen | Destino | Notas |
|---|---|---|
| `config/i18n.ts` (533 líneas) | `shared/config/i18n.ts` | Sin cambios. Solo actualizar imports internos (no tiene). |
| `config/theme.ts` (207 líneas) | `shared/config/theme.ts` | Cambiar import de `../styles/glassStyles` → `@/shared/ui/glassStyles`. |
| `styles/glassStyles.ts` (42 líneas) | `shared/config/glassStyles.ts` | Reubicado aquí como constantes de diseño. Sin imports internos. |

#### `shared/config/index.ts`
```ts
export { default as i18n } from './i18n';
export { createAppTheme } from './theme';
export { glassColors, glassEffects, glassAnimations } from './glassStyles';
```

### 2.3 `shared/lib/` — Utilidades puras

| Origen | Destino | Notas |
|---|---|---|
| `utils/requestCache.ts` (76 líneas) | `shared/lib/requestCache.ts` | Sin cambios. Cero imports de proyecto. |
| `utils/sanitizers.ts` (48 líneas) | `shared/lib/sanitizers.ts` | Sin cambios. |
| `utils/imageUtils.ts` (32 líneas) | `shared/lib/imageUtils.ts` | Sin cambios. |
| `utils/notificationEvents.ts` (19 líneas) | `shared/lib/notificationEvents.ts` | Sin cambios. |

Además, crear `shared/lib/types.ts` con los tipos compartidos (extraídos de `types/index.ts`):
- `MessageResponse`
- `ApiError`
- `ForgotPasswordRequest`
- `ResetPasswordRequest`

#### `shared/lib/index.ts`
```ts
export { requestCache } from './requestCache';
export { parseUrlStringToArray, parseCommaSeparatedString } from './sanitizers';
export { formatImageUrl } from './imageUtils';
export { notificationEvents } from './notificationEvents';
export type { MessageResponse, ApiError, ForgotPasswordRequest, ResetPasswordRequest } from './types';
```

### 2.4 `shared/ui/` — Kit de UI genérico

Componentes **sin lógica de negocio** (no importan stores, contextos, ni servicios):

| Origen | Destino | Notas |
|---|---|---|
| `components/common/ErrorBoundary.tsx` | `shared/ui/ErrorBoundary.tsx` | Class component, sin imports de proyecto. |
| `components/common/ErrorState.tsx` | `shared/ui/ErrorState.tsx` | Sin imports de proyecto (solo MUI + i18next). |
| `components/common/EmptyState.tsx` | `shared/ui/EmptyState.tsx` | Sin imports de proyecto. |
| `components/common/ConfirmDialog.tsx` | `shared/ui/ConfirmDialog.tsx` | Sin imports de proyecto. |
| `components/common/ImageWithFallback.tsx` | `shared/ui/ImageWithFallback.tsx` | Sin imports de proyecto. |
| `components/common/RichTextRenderer.tsx` | `shared/ui/RichTextRenderer.tsx` | Sin imports de proyecto. |
| `components/common/ScrollableContent.tsx` | `shared/ui/ScrollableContent.tsx` | Sin imports de proyecto. |
| `components/common/SkeletonLoaders.tsx` | `shared/ui/SkeletonLoaders.tsx` | Sin imports de proyecto. |

**Importante**: `LanguageSelector` y `ThemeSelector` NO van aquí — tienen lógica de negocio (contextos). Van en `features/`.

#### `shared/ui/index.ts`
```ts
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ErrorState } from './ErrorState';
export { default as EmptyState } from './EmptyState';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as ImageWithFallback } from './ImageWithFallback';
export { default as RichTextRenderer } from './RichTextRenderer';
export { default as ScrollableContent } from './ScrollableContent';
export { HeroSkeleton, ProjectCardSkeleton, ProjectGridSkeleton, AboutSkeleton, SkillsSkeleton, ExperienceSkeleton, PageHeaderSkeleton, ContactSkeleton } from './SkeletonLoaders';
```

### 2.5 `shared/index.ts` (raíz)
```ts
export * from './api';
export * from './config';
export * from './lib';
export * from './ui';
```

### Verificación
- [ ] `npx eslint src/shared/` pasa con 0 errores, 0 warnings.
- [ ] `npx tsc --noEmit` muestra errores solo por imports cross-layer aún no migrados (esperado).
- [ ] Todos los archivos en `shared/` solo importan de dentro de `shared/` o de dependencias externas.

### Tests a actualizar en esta fase
Los siguientes tests se romperán al mover los archivos fuente. Actualizar sus imports para que usen los nuevos paths `@/shared/...`:

| Test | Archivo origen → nuevo | Acción |
|---|---|---|
| `requestCache.test.ts` | `@/utils/requestCache` → `@/shared/lib/requestCache` | Actualizar import |
| `sanitizers.test.ts` | `@/utils/sanitizers` → `@/shared/lib/sanitizers` | Actualizar import |
| `imageUtils.test.ts` | `@/utils/imageUtils` → `@/shared/lib/imageUtils` | Actualizar import |
| `notificationEvents.test.ts` | `@/utils/notificationEvents` → `@/shared/lib/notificationEvents` | Actualizar import |
| `theme.test.ts` | `@/config/theme` → `@/shared/config/theme` | Actualizar import |
| `apiClient` (nuevo test) | — | Crear test para `shared/api/client.ts` |

Los tests de servicios (`publicService.test.ts`, `adminService.test.ts`, `authService.test.ts`) no requieren cambios en esta fase — se actualizarán en Fase 3 cuando se dividan por entidad.

- [ ] `pnpm test` — los tests de `shared/` pasan.

---

## Fase 3 — Capa `entities/`

### Objetivo
Crear slices por cada entidad de dominio con types, API calls, stores, hooks y componentes UI básicos de presentación.

### Reglas FSD para entities
- `model/`: solo `.ts`. Types, stores (Zustand), hooks, validación. NUNCA `.tsx` ni `.css`.
- `api/`: solo `.ts`. Funciones que llaman endpoints de esa entidad. Usan `@/shared/api/client`.
- `ui/`: `.tsx` + `.css`. Componentes de presentación de la entidad.
- `index.ts`: API pública curada del slice.

### 3.1 `entities/user/` — Autenticación

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `AuthResponse` | `entities/user/model/types.ts` | Extraer interfaz `AuthResponse`. |
| `context/AuthStore.tsx` | `entities/user/model/store.ts` | Renombrar a `.ts` (no JSX). Cambiar imports a `@/entities/user/api/authApi` y `@/entities/user/model/types`. |
| `services/authService.ts` | `entities/user/api/authApi.ts` | Renombrar exports: `authService` → `authApi`. Importar `apiClient` desde `@/shared/api`. Importar types desde `./model/types` (relativo interno permitido) o `@/entities/user/model/types`. |

**`entities/user/index.ts`**:
```ts
export { useAuthStore } from './model/store';
export { authApi } from './api/authApi';
export type { AuthResponse } from './model/types';
```

### 3.2 `entities/skill/`

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `Skill` | `entities/skill/model/types.ts` | Extraer interfaz `Skill`. |
| `services/publicService.ts` → `getAllSkills` | `entities/skill/api/skillApi.ts` | Función `getAllSkills` usa `apiClient` de `@/shared/api`. |
| `services/adminService.ts` → skills CRUD | `entities/skill/api/skillApi.ts` | Funciones `getSkills`, `createSkill`, `updateSkill`, `deleteSkill`. |
| — (nuevo) | `entities/skill/ui/SkillBar.tsx` | Extraer de `SkillsPage.tsx` el componente de barra de progreso de skill. |

**`entities/skill/index.ts`**:
```ts
export { getAllSkills, getSkills, createSkill, updateSkill, deleteSkill } from './api/skillApi';
export { SkillBar } from './ui/SkillBar';
export type { Skill } from './model/types';
```

### 3.3 `entities/experience/`

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `Experience` | `entities/experience/model/types.ts` | Extraer interfaz. |
| `services/publicService.ts` → `getAllExperiences` | `entities/experience/api/experienceApi.ts` | |
| `services/adminService.ts` → experiences CRUD | `entities/experience/api/experienceApi.ts` | |
| — (nuevo) | `entities/experience/ui/ExperienceTimelineItem.tsx` | Extraer de `ExperiencePage.tsx` y `ExperiencesManagement.tsx` el item individual de timeline. |

**`entities/experience/index.ts`**:
```ts
export { getAllExperiences, getExperiences, createExperience, updateExperience, deleteExperience } from './api/experienceApi';
export { ExperienceTimelineItem } from './ui/ExperienceTimelineItem';
export type { Experience } from './model/types';
```

### 3.4 `entities/project/`

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `Project` | `entities/project/model/types.ts` | |
| `services/publicService.ts` → `getAllProjects`, `getFeaturedProjects` | `entities/project/api/projectApi.ts` | |
| `services/adminService.ts` → projects CRUD | `entities/project/api/projectApi.ts` | |
| `components/portfolio/ProjectCard.tsx` | `entities/project/ui/ProjectCard.tsx` | Cambiar imports: `@/types` → `@/entities/project`, `@/context/LanguageContext` → `@/features/language-switch`, `@/components/common/*` → `@/shared/ui/*`, `@/utils/imageUtils` → `@/shared/lib`. `./ProjectGallery` → `@/features/project-gallery`. |

**`entities/project/index.ts`**:
```ts
export { getAllProjects, getFeaturedProjects, getProjects, createProject, updateProject, deleteProject } from './api/projectApi';
export { ProjectCard } from './ui/ProjectCard';
export type { Project } from './model/types';
```

### 3.5 `entities/profile/`

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `Profile` | `entities/profile/model/types.ts` | |
| `services/publicService.ts` → `getProfile` | `entities/profile/api/profileApi.ts` | |
| `services/adminService.ts` → `updateProfile` | `entities/profile/api/profileApi.ts` | |
| `hooks/useProfile.ts` | `entities/profile/model/useProfile.ts` | Cambiar imports: `@/services/publicService` → `@/entities/profile/api/profileApi`, `@/utils/requestCache` → `@/shared/lib`, `@/config/i18n` → `@/shared/config`, `@/types` → `./types` (relativo interno). |

**`entities/profile/index.ts`**:
```ts
export { getProfile, updateProfile } from './api/profileApi';
export { useProfile } from './model/useProfile';
export type { Profile } from './model/types';
```

### 3.6 `entities/spoken-language/`

| Origen | Destino | Adaptaciones |
|---|---|---|
| `types/index.ts` → `SpokenLanguage` | `entities/spoken-language/model/types.ts` | |
| `services/publicService.ts` → `getAllSpokenLanguages` | `entities/spoken-language/api/languageApi.ts` | |
| `services/adminService.ts` → languages CRUD | `entities/spoken-language/api/languageApi.ts` | |

**`entities/spoken-language/index.ts`**:
```ts
export { getAllSpokenLanguages, getSpokenLanguages, createSpokenLanguage, updateSpokenLanguage, deleteSpokenLanguage } from './api/languageApi';
export type { SpokenLanguage } from './model/types';
```

### Verificación
- [ ] `npx eslint src/entities/` pasa.
- [ ] Ningún archivo en `entities/` importa de `features/`, `widgets/`, `pages/`, o `app/`.
- [ ] Los segmentos `model/` solo contienen archivos `.ts`.
- [ ] Los segmentos `ui/` contienen `.tsx` y opcionalmente `.css` co-localizado.

### Tests a actualizar en esta fase
Los servicios se dividen por entidad. Actualizar los tests en consecuencia:

| Test | Cambio necesario |
|---|---|
| `AuthStore.test.ts` | Mover a `entities/user/`. Reemplazar mock de `../services/authService` → `@/entities/user/api/authApi`. |
| `useProfile.test.ts` | Mover a `entities/profile/`. Reemplazar mock de `@/services/publicService` → `@/entities/profile/api/profileApi`. |
| `publicService.test.ts` | **Dividir** en `skillApi.test.ts`, `experienceApi.test.ts`, `projectApi.test.ts`, `profileApi.test.ts`, `languageApi.test.ts` en sus respectivos `entities/<entity>/api/`. |
| `adminService.test.ts` | Ídem, las funciones CRUD se fusionan en los mismos archivos de API por entidad. |
| `authService.test.ts` | Mover a `entities/user/api/authApi.test.ts`. |

- [ ] `pnpm test` — los tests de `entities/` pasan con los nuevos paths.

---

## Fase 4 — Capa `features/`

### Objetivo
Migrar interacciones de usuario: auth flows, theme/language switching, formularios CRUD, galería, contacto. Cada feature puede importar de `entities/` y `shared/`.

### 4.1 `features/theme-switch/`

El `ThemeContext.tsx` actual (69 líneas) contiene tanto el contexto + hook como el provider (JSX). Hay que dividirlo para cumplir `no-ui-in-business-logic`.

| Origen | Destino | Tipo | Contenido |
|---|---|---|---|
| `context/ThemeContext.tsx` | `features/theme-switch/model/ThemeContext.ts` | `.ts` | `ColorModeContext`, `useColorMode` hook, tipo `ColorMode`. Sin JSX. |
| `context/ThemeContext.tsx` | `features/theme-switch/ui/ThemeProvider.tsx` | `.tsx` | Componente `ThemeProvider` que envuelve `MuiThemeProvider` + `CssBaseline`. |
| `components/common/ThemeSelector.tsx` | `features/theme-switch/ui/ThemeSelector.tsx` | `.tsx` | Componente selector de tema. Importa `useColorMode` desde `@/features/theme-switch/model/ThemeContext`. |

**`features/theme-switch/index.ts`**:
```ts
export { ThemeProvider } from './ui/ThemeProvider';
export { ThemeSelector } from './ui/ThemeSelector';
export { useColorMode } from './model/ThemeContext';
export type { ColorMode } from './model/ThemeContext';
```

**Adaptación en `ThemeProvider`**: el import de `createAppTheme` cambia de `../config/theme` → `@/shared/config/theme`.

### 4.2 `features/language-switch/`

Mismo patrón de split:

| Origen | Destino | Tipo |
|---|---|---|
| `context/LanguageContext.tsx` | `features/language-switch/model/LanguageContext.ts` | `.ts` — `LanguageContext`, `useLanguage` hook, tipo `Language`. |
| `context/LanguageContext.tsx` | `features/language-switch/ui/LanguageProvider.tsx` | `.tsx` — `LanguageProvider` component. |
| `components/common/LanguageSelector.tsx` | `features/language-switch/ui/LanguageSelector.tsx` | `.tsx` |

**`features/language-switch/index.ts`**:
```ts
export { LanguageProvider } from './ui/LanguageProvider';
export { LanguageSelector } from './ui/LanguageSelector';
export { useLanguage } from './model/LanguageContext';
export type { Language } from './model/LanguageContext';
```

### 4.3 `features/notifications/`

| Origen | Destino | Tipo |
|---|---|---|
| `context/NotificationContext.tsx` | `features/notifications/model/NotificationContext.ts` | `.ts` — `NotificationContext`, `useNotification` hook. |
| `context/NotificationContext.tsx` | `features/notifications/ui/NotificationProvider.tsx` | `.tsx` — Provider con `Snackbar` + `Alert`. |

**`features/notifications/index.ts`**:
```ts
export { NotificationProvider } from './ui/NotificationProvider';
export { useNotification } from './model/NotificationContext';
```

**Adaptación**: el import de `notificationEvents` cambia de `@/utils/notificationEvents` → `@/shared/lib/notificationEvents`.

### 4.4 `features/auth/`

| Origen | Destino | Notas |
|---|---|---|
| `App.tsx` → `ProtectedRoute` | `features/auth/ui/ProtectedRoute.tsx` | Componente de ruta protegida. Importa `useAuthStore` desde `@/entities/user`. |
| `pages/admin/LoginPage.tsx` | `features/auth/ui/LoginForm.tsx` | Extraer solo el formulario. La página en Fase 6 será un wrapper delgado. |
| `pages/admin/ForgotPasswordPage.tsx` | `features/auth/ui/ForgotPasswordForm.tsx` | Ídem. |
| `pages/admin/ResetPasswordPage.tsx` | `features/auth/ui/ResetPasswordForm.tsx` | Ídem. |

**`features/auth/index.ts`**:
```ts
export { ProtectedRoute } from './ui/ProtectedRoute';
export { LoginForm } from './ui/LoginForm';
export { ForgotPasswordForm } from './ui/ForgotPasswordForm';
export { ResetPasswordForm } from './ui/ResetPasswordForm';
```

### 4.5 `features/contact-form/`

| Origen | Destino |
|---|---|
| `components/layout/ContactForm.tsx` | `features/contact-form/ui/ContactForm.tsx` |

**`features/contact-form/index.ts`**:
```ts
export { default as ContactForm } from './ui/ContactForm';
```

**Adaptación**: `useNotification` pasa de `@/context/NotificationContext` → `@/features/notifications`.

### 4.6 `features/project-gallery/`

| Origen | Destino |
|---|---|
| `components/portfolio/ProjectGallery.tsx` | `features/project-gallery/ui/ProjectGallery.tsx` |

**`features/project-gallery/index.ts`**:
```ts
export { default as ProjectGallery } from './ui/ProjectGallery';
```

### 4.7 Features CRUD (admin form dialogs)

| Feature | Origen | Destino |
|---|---|---|
| `features/skill-crud/` | `components/admin/SkillFormDialog.tsx` | `features/skill-crud/ui/SkillFormDialog.tsx` |
| `features/experience-crud/` | `components/admin/ExperienceFormDialog.tsx` | `features/experience-crud/ui/ExperienceFormDialog.tsx` |
| `features/project-crud/` | `components/admin/ProjectFormDialog.tsx` | `features/project-crud/ui/ProjectFormDialog.tsx` |
| `features/language-crud/` | `components/admin/SpokenLanguageFormDialog.tsx` | `features/language-crud/ui/SpokenLanguageFormDialog.tsx` |

**Adaptaciones**: imports de `@/types` → `@/entities/<entity>/model/types`.

Cada uno exporta su componente y sus tipos de payload vía `index.ts`.

### 4.8 `features/profile-editor/`

| Origen | Destino |
|---|---|
| `components/admin/profile/HomeTab.tsx` | `features/profile-editor/ui/HomeTab.tsx` |
| `components/admin/profile/AboutTab.tsx` | `features/profile-editor/ui/AboutTab.tsx` |
| `components/admin/profile/GeneralCvTab.tsx` | `features/profile-editor/ui/GeneralCvTab.tsx` |
| `components/admin/profile/PersonalSocialTab.tsx` | `features/profile-editor/ui/PersonalSocialTab.tsx` |

**`features/profile-editor/index.ts`**:
```ts
export { HomeTab } from './ui/HomeTab';
export { AboutTab } from './ui/AboutTab';
export { GeneralCvTab } from './ui/GeneralCvTab';
export { PersonalSocialTab } from './ui/PersonalSocialTab';
```

### Verificación
- [ ] `npx eslint src/features/` pasa.
- [ ] Ningún feature importa de `widgets/`, `pages/`, o `app/`.
- [ ] Ningún feature importa de otro feature al mismo nivel (cross-slice dependency).
- [ ] Segmentos `model/` solo `.ts`. Segmentos `ui/` solo `.tsx` (+ `.css`).

### Tests a actualizar en esta fase
Los contextos se dividen en `model/` (.ts) + `ui/` (.tsx) y se mueven a la capa `features/`:

| Test | Cambio necesario |
|---|---|
| `ThemeContext.test.tsx` | Mover a `features/theme-switch/`. Actualizar imports para `useColorMode` y `ThemeProvider` desde las nuevas ubicaciones. |
| `LanguageContext.test.tsx` | Mover a `features/language-switch/`. Actualizar imports para `useLanguage` y `LanguageProvider`. |
| `NotificationContext.test.tsx` | Mover a `features/notifications/`. Actualizar imports para `useNotification` y `NotificationProvider`. |

- [ ] `pnpm test` — los tests de `features/` pasan.

---

## Fase 5 — Capa `widgets/`

### Objetivo
Migrar bloques UI compuestos: layouts, navbar, footer, dashboard layout. Los widgets combinan entities + features + shared.

### 5.1 Mapeo

| Origen | Destino |
|---|---|
| `components/layout/PublicLayout.tsx` | `widgets/public-layout/ui/PublicLayout.tsx` |
| `components/layout/Navbar.tsx` | `widgets/navbar/ui/Navbar.tsx` |
| `components/layout/Footer.tsx` | `widgets/footer/ui/Footer.tsx` |
| `components/admin/DashboardLayout.tsx` | `widgets/dashboard-layout/ui/DashboardLayout.tsx` |

### 5.2 Adaptaciones de imports

| Widget | Import antiguo → Nuevo |
|---|---|
| `PublicLayout` | `./Navbar` → `@/widgets/navbar`, `./Footer` → `@/widgets/footer`, `@/context/ThemeContext` → `@/features/theme-switch` |
| `Navbar` | `@/context/ThemeContext` → `@/features/theme-switch`, `../common/LanguageSelector` → `@/features/language-switch`, `../common/ThemeSelector` → `@/features/theme-switch`, `@/context/AuthStore` → `@/entities/user`, `@/hooks/useProfile` → `@/entities/profile`, `@/styles/glassStyles` → `@/shared/config` |
| `Footer` | `@/context/LanguageContext` → `@/features/language-switch`, `@/context/ThemeContext` → `@/features/theme-switch`, `@/hooks/useProfile` → `@/entities/profile`, `@/styles/glassStyles` → `@/shared/config` |
| `DashboardLayout` | `@/context/AuthStore` → `@/entities/user`, `../common/LanguageSelector` → `@/features/language-switch` |

### 5.3 API pública por widget

Cada widget tiene su `index.ts`:
```ts
// widgets/navbar/index.ts
export { default as Navbar } from './ui/Navbar';
```

### Verificación
- [ ] `npx eslint src/widgets/` pasa.
- [ ] Ningún widget importa de `pages/` o `app/`.
- [ ] Los widgets solo importan de `features/`, `entities/`, `shared/`.

### Tests en esta fase
Los widgets no tienen tests unitarios propios (son componentes de composición). Los tests de las capas inferiores ya deberían pasar. Verificar que `pnpm test` sigue en verde.

---

## Fase 6 — Capa `pages/`

### Objetivo
Migrar todas las páginas como composiciones delgadas. Cada página orquesta widgets + features + entities. Se mantiene `React.lazy()` para code-splitting.

### 6.1 Páginas públicas

| Origen | Destino |
|---|---|
| `pages/public/HomePage.tsx` | `pages/home/ui/HomePage.tsx` |
| `pages/public/AboutPage.tsx` | `pages/about/ui/AboutPage.tsx` |
| `pages/public/SkillsPage.tsx` | `pages/skills/ui/SkillsPage.tsx` |
| `pages/public/ExperiencePage.tsx` | `pages/experience/ui/ExperiencePage.tsx` |
| `pages/public/ProjectsPage.tsx` | `pages/projects/ui/ProjectsPage.tsx` |
| `pages/public/ContactPage.tsx` | `pages/contact/ui/ContactPage.tsx` |

### 6.2 Páginas admin

| Origen | Destino |
|---|---|
| `pages/admin/LoginPage.tsx` | `pages/admin/login/ui/LoginPage.tsx` |
| `pages/admin/ForgotPasswordPage.tsx` | `pages/admin/forgot-password/ui/ForgotPasswordPage.tsx` |
| `pages/admin/ResetPasswordPage.tsx` | `pages/admin/reset-password/ui/ResetPasswordPage.tsx` |
| `pages/admin/SkillsManagement.tsx` | `pages/admin/skills/ui/SkillsManagementPage.tsx` |
| `pages/admin/ExperiencesManagement.tsx` | `pages/admin/experiences/ui/ExperiencesManagementPage.tsx` |
| `pages/admin/ProjectsManagement.tsx` | `pages/admin/projects/ui/ProjectsManagementPage.tsx` |
| `pages/admin/ProfileManagement.tsx` | `pages/admin/profile/ui/ProfileManagementPage.tsx` |
| `pages/admin/SpokenLanguageManagement.tsx` | `pages/admin/languages/ui/SpokenLanguageManagementPage.tsx` |
| `pages/admin/ExternalResources.tsx` | `pages/admin/external-resources/ui/ExternalResourcesPage.tsx` |

### 6.3 Adaptaciones sistemáticas de imports

**Patrón general**: todos los imports relativos y aliases antiguos se reemplazan por `@/` apuntando a la capa FSD correcta.

| Import antiguo | Nuevo import |
|---|---|
| `@/services/publicService` | `@/entities/<entity>/api/<entity>Api` |
| `@/services/adminService` | `@/entities/<entity>/api/<entity>Api` |
| `@/services/authService` | `@/entities/user/api/authApi` |
| `@/types` | `@/entities/<entity>` o `@/shared/lib` |
| `@/context/LanguageContext` | `@/features/language-switch` |
| `@/context/ThemeContext` | `@/features/theme-switch` |
| `@/context/NotificationContext` | `@/features/notifications` |
| `@/context/AuthStore` | `@/entities/user` |
| `@/hooks/useProfile` | `@/entities/profile` |
| `@/components/common/*` | `@/shared/ui` |
| `@/components/layout/*` | `@/widgets/<widget>` |
| `@/components/portfolio/*` | `@/entities/project` o `@/features/project-gallery` |
| `@/components/admin/*` | `@/features/<feature>` |
| `@/utils/*` | `@/shared/lib` |
| `@/config/i18n` | `@/shared/config` |
| `@/config/theme` | `@/shared/config` |
| `@/styles/glassStyles` | `@/shared/config` |

### 6.4 API pública por página

```ts
// pages/home/index.ts
export { default as HomePage } from './ui/HomePage';
```

### 6.5 LoginPage — página delgada

La página de login actual contiene formulario + lógica. Tras la migración, `LoginPage` importa `LoginForm` de `@/features/auth` y es un wrapper delgado:

```tsx
// pages/admin/login/ui/LoginPage.tsx
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return <LoginForm />;
}
```

Mismo patrón para `ForgotPasswordPage` y `ResetPasswordPage`.

### Verificación
- [ ] `npx eslint src/pages/` pasa.
- [ ] `npx tsc --noEmit` — 0 errores (para este punto, todos los imports deberían resolverse).
- [ ] Cada página exporta `default` vía `React.lazy()` compatible.
- [ ] Las páginas admin importan `useNotification` de `@/features/notifications`, `useLanguage` de `@/features/language-switch`.

### Tests en esta fase
Las páginas no tienen tests unitarios propios. Verificar que `pnpm test` sigue en verde. El build `tsc --noEmit` debe dar 0 errores — esto valida que todos los imports cross-layer están correctos.

---

## Fase 7 — Capa `app/` + Entry Point

### Objetivo
Montar la aplicación: providers, routing, estilos globales, y entry point.

### 7.1 `app/api/interceptors.ts`

El interceptor de request (JWT + Accept-Language) y el de response (401 redirect) que se extrajeron de `shared/api/client.ts` en Fase 2 se colocan aquí. `app/` puede importar de cualquier capa inferior.

```ts
// app/api/interceptors.ts
import { apiClient } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import { i18n } from '@/shared/config';

export function setupInterceptors() {
  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = i18n.language;
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const path = window.location.pathname || '';
        if (path.startsWith('/admin') && path !== '/admin/login') {
          useAuthStore.getState().logout();
          window.location.replace('/admin/login');
        }
      }
      return Promise.reject(error);
    }
  );
}
```

### 7.2 `app/providers/`

Composición de providers en el orden correcto:

```tsx
// app/providers/index.tsx
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '@/features/language-switch';
import { ThemeProvider } from '@/features/theme-switch';
import { NotificationProvider } from '@/features/notifications';
import { setupInterceptors } from '@/app/api/interceptors';

setupInterceptors();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
```

### 7.3 `app/routing/`

Migrar `App.tsx` del portafolio → `app/routing/AppRouter.tsx`. Todas las rutas se mantienen idénticas en comportamiento. Los `React.lazy()` importan desde `@/pages/<page>`.

```tsx
// app/routing/AppRouter.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth';
import { PublicLayout } from '@/widgets/public-layout';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { PageHeaderSkeleton } from '@/shared/ui';

const HomePage = lazy(() => import('@/pages/home'));
// ... resto de páginas

export default function AppRouter() {
  return (
    <Suspense fallback={<PageHeaderSkeleton />}>
      <Routes>
        {/* Rutas públicas (igual que en App.tsx actual) */}
        {/* Rutas admin (igual que en App.tsx actual) */}
      </Routes>
    </Suspense>
  );
}
```

### 7.4 `app/styles/`

| Origen | Destino |
|---|---|
| `src/index.css` | `app/styles/index.css` |
| `src/App.css` (residual) | `app/styles/app.css` o se fusiona con `index.css` |

### 7.5 `main.tsx` — Entry point

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/app/providers';
import AppRouter from '@/app/routing/AppRouter';
import { ErrorBoundary } from '@/shared/ui';
import '@/app/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  </StrictMode>,
);
```

### 7.6 `app/index.ts`

```ts
export { AppProviders } from './providers';
export { default as AppRouter } from './routing/AppRouter';
```

### Verificación
- [ ] `npx tsc --noEmit` — 0 errores.
- [ ] `npx eslint .` — 0 errores, 0 warnings (las 5 reglas FSD pasan).
- [ ] `pnpm run build` — build exitoso.

### Tests en esta fase
Todos los tests deben pasar sin modificaciones adicionales. Esta fase solo compone capas ya migradas (app/ importa de pages/, pages/ importa de widgets/, etc.).

- [ ] `pnpm test` — todos los tests en verde (confirmación final de no regresión).

---

## Fase 8 — Limpieza, verificación y testing

### Objetivo
Eliminar archivos residuales, verificar build de producción, y probar con Docker Compose.

### 8.1 Limpieza

Eliminar cualquier archivo o directorio sobrante en `src/` que no pertenezca a la estructura FSD:
- `src/App.tsx`, `src/App.css` — ya migrados a `app/`
- `src/index.css` — ya migrado a `app/styles/`
- `src/assets/` — assets de demo de la plantilla (hero.png, react.svg, vite.svg) si no se usan
- Cualquier carpeta de la estructura antigua que quede vacía

### 8.2 Verificación estática

- [ ] `pnpm run lint` — 0 errores, 0 warnings.
- [ ] `pnpm run build` — build exitoso, chunks generados correctamente.
- [ ] Revisar `dist/` — `react-vendor` y `mui-vendor` chunks presentes.

### 8.3 Testing con Docker Compose

1. Levantar el backend y frontend: `docker compose up --build`
2. Checklist de pruebas manuales:

**Sitio público**:
- [ ] Home page: hero, proyectos destacados, about preview
- [ ] About page: foto, skills destacadas, idiomas
- [ ] Skills page: agrupadas por categoría, barras de progreso
- [ ] Experience page: timeline con fechas y tecnologías
- [ ] Projects page: grid, galería lightbox con zoom
- [ ] Contact page: info, formulario EmailJS, notificación éxito/error
- [ ] Cambio de tema (light → dark → glass)
- [ ] Cambio de idioma (EN ↔ ES)
- [ ] Responsive: menú mobile, tablas→cards, layout adaptable

**Panel admin**:
- [ ] Login: éxito, error 401, redirección
- [ ] Forgot password: envío, mensaje
- [ ] Reset password: validación, redirección a login
- [ ] Logout: redirección a login
- [ ] CRUD Skills: crear, editar, eliminar (con ConfirmDialog)
- [ ] CRUD Experiences: crear, editar, eliminar
- [ ] CRUD Projects: crear, editar, eliminar
- [ ] Profile: editar 4 tabs, guardar
- [ ] Spoken Languages: CRUD
- [ ] External Resources: cards con links

**Edge cases**:
- [ ] ErrorBoundary: simular crash → botón refresh
- [ ] ErrorState: desconectar backend → retry
- [ ] EmptyState: sin datos → mensaje
- [ ] Token expirado → redirect automático a login
- [ ] Skeleton loaders durante carga
- [ ] Cold start notification si backend tarda >3s

### 8.4 Finalización

Si todo el checklist pasa, la migración está completa. El desarrollador decide cuándo hacer commit y push de los cambios.

---

## Anexo A — Reglas FSD activas

| Regla ESLint | Nivel | Descripción |
|---|---|---|
| `fsd-lint/forbidden-imports` | `error` | Prohíbe imports desde capas superiores (ej. `entities/` → `features/`) |
| `fsd-lint/no-relative-imports` | `error` | Prohíbe imports relativos entre slices (ej. `../../shared/ui`) |
| `fsd-lint/no-public-api-sidestep` | `error` | Prohíbe bypass del `index.ts` (ej. `@/features/auth/model/store`) |
| `fsd-lint/no-cross-slice-dependency` | `error` | Prohíbe imports entre slices del mismo nivel (ej. `features/auth` → `features/theme`) |
| `fsd-lint/no-ui-in-business-logic` | `error` | Prohíbe `.tsx` y `.css` en segmentos `model/`, `api/`, `lib/`, `config/` |

**Jerarquía de dependencia permitida**:

```
app/ ──> pages/ ──> widgets/ ──> features/ ──> entities/ ──> shared/
  │        │          │            │              │
  └────────┴──────────┴────────────┴──────────────┴──> shared/ (todos)
```

---

## Anexo B — Mapa de dependencias

### B.1 Dependencias de `shared/`

Ninguna. `shared/` es autónomo.

### B.2 `entities/` → ¿quién importa qué?

| Entidad | Consumidores (tras migración) |
|---|---|
| `entities/user` | `app/api/interceptors`, `features/auth`, `widgets/navbar`, `widgets/dashboard-layout`, `pages/admin/login` |
| `entities/skill` | `pages/skills`, `pages/about`, `pages/admin/skills`, `features/skill-crud` |
| `entities/experience` | `pages/experience`, `pages/admin/experiences`, `features/experience-crud` |
| `entities/project` | `pages/home`, `pages/projects`, `pages/admin/projects`, `features/project-crud`, `features/project-gallery`, `widgets/navbar` (indirecto via useProfile) |
| `entities/profile` | `pages/home`, `pages/about`, `pages/contact`, `pages/admin/profile`, `features/profile-editor`, `widgets/navbar`, `widgets/footer` |
| `entities/spoken-language` | `pages/about`, `pages/admin/languages`, `features/language-crud` |

### B.2 `features/` → ¿quién importa qué?

| Feature | Consumidores |
|---|---|
| `features/theme-switch` | `app/providers`, `widgets/navbar`, `widgets/footer`, `widgets/public-layout` |
| `features/language-switch` | `app/providers`, `widgets/navbar`, `widgets/footer`, `widgets/dashboard-layout`, `pages/*` (muchas) |
| `features/notifications` | `app/providers`, `pages/admin/*`, `features/contact-form` |
| `features/auth` | `app/routing`, `pages/admin/login`, `pages/admin/forgot-password`, `pages/admin/reset-password` |
| `features/contact-form` | `pages/contact` |
| `features/project-gallery` | `entities/project/ui/ProjectCard` |
| `features/skill-crud` | `pages/admin/skills` |
| `features/experience-crud` | `pages/admin/experiences` |
| `features/project-crud` | `pages/admin/projects` |
| `features/language-crud` | `pages/admin/languages` |
| `features/profile-editor` | `pages/admin/profile` |

---

## Anexo C — Riesgos y mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|
| TS6 `erasableSyntaxOnly` rompe imports de tipo | Medio | Baja | Solo aplica en `tsconfig.node.json`. Usar `import type` donde sea necesario. |
| Vite 8 incompatibilidad con `@vitejs/plugin-react` v5 | Alto | Baja | Usamos v6 (incluido en plantilla). |
| `eslint-plugin-fsd-lint` no testeado con ESLint 10 | Medio | Baja | Peer dep `>=9.0.0`. Si falla, bajar a ESLint 9 como fallback. |
| `no-ui-in-business-logic` rechaza providers con JSX | Alto | Media | Se mitiga en Fase 4 splitiendo contextos en `model/` (.ts) + `ui/` (.tsx). |
| `apiClient` en `shared/api/` no puede importar `useAuthStore` | Alto | Resuelto | Split en Fase 2 + Fase 7: infraestructura en `shared/`, interceptors en `app/`. |
| Regresión funcional durante migración | Alto | Media | Checklist exhaustivo en Fase 8. No se hace push hasta verificación completa. |
| Páginas admin actualmente contienen lógica + formulario | Medio | Alta | Se extrae formulario a feature manteniendo página como wrapper. |
| Pérdida de code-splitting | Medio | Baja | `React.lazy()` se mantiene en `AppRouter` apuntando a las nuevas rutas. |

---

## Anexo D — Inventario de tests unitarios (pre-migración)

14 archivos de test creados, cubriendo toda la lógica del frontend. Todos siguen el mismo patrón: `describe`/`it`, mocks con `vi.mock`, `@testing-library/react` para hooks.

### D.1 Utilidades (`src/utils/`) — 4 tests

| Test | Cobertura | Mock |
|---|---|---|
| `requestCache.test.ts` | `get`, `set`, `clear`, `remove`, `prune`, expiración TTL, datos corruptos, prefijo `api_cache_` | `localStorage` |
| `sanitizers.test.ts` | `parseUrlStringToArray` (multilínea, backticks, comillas, arrays), `parseCommaSeparatedString` | Ninguno (funciones puras) |
| `imageUtils.test.ts` | `formatImageUrl` (Google Drive `/d/` y `?id=`, URLs normales, input falsy) | Ninguno |
| `notificationEvents.test.ts` | `subscribe`, `emit`, `unsubscribe`, múltiples listeners, throw en listener | Ninguno |

### D.2 Configuración (`src/config/`) — 1 test

| Test | Cobertura | Mock |
|---|---|---|
| `theme.test.ts` | `createAppTheme` para `light`, `dark`, `glass` (paleta, tipografía, overrides) | Ninguno |

### D.3 Servicios (`src/services/`) — 3 tests

| Test | Cobertura | Mock |
|---|---|---|
| `publicService.test.ts` | 6 métodos: `getAllSkills`, `getAllExperiences`, `getAllProjects`, `getAllSpokenLanguages`, `getProfile`, `getFeaturedProjects` | `apiClient` |
| `adminService.test.ts` | CRUD completo para Skills, Experiences, Projects, Profile, SpokenLanguages | `apiClient` |
| `authService.test.ts` | `login`, `validateToken`, `forgotPassword`, `resetPassword` | `apiClient` |

### D.4 Estado global (`src/context/`) — 4 tests

| Test | Cobertura | Mock |
|---|---|---|
| `AuthStore.test.ts` | Zustand: `login`, `logout`, `validateToken` (válido, inválido, sin token, error red) | `authService` |
| `ThemeContext.test.tsx` | `useColorMode` + `ThemeProvider`: toggle cíclico, set explícito, persistencia localStorage | `localStorage`, `matchMedia` |
| `LanguageContext.test.tsx` | `useLanguage` + `LanguageProvider`: toggle en↔es, set explícito, persistencia, error fuera de provider | `react-i18next` |
| `NotificationContext.test.tsx` | `useNotification` + `NotificationProvider`: suscripción a eventos, error fuera de provider | `notificationEvents` |

### D.5 Hooks (`src/hooks/`) — 1 test

| Test | Cobertura | Mock |
|---|---|---|
| `useProfile.test.ts` | `useProfile`: fetch exitoso, datos cacheados, error de red, `refetch` | `publicService`, `requestCache`, `i18n` |

### D.6 Ejecución

```bash
pnpm test          # Ejecutar todos los tests una vez
pnpm test:watch    # Modo watch para desarrollo
```

### D.7 Convenciones de testing

- **Co-localización**: cada test está junto al archivo que prueba (`src/utils/requestCache.test.ts` junto a `src/utils/requestCache.ts`)
- **Nombrado**: `describe('modulo', () => { describe('funcion', () => { it('comportamiento', ...) }) })`
- **Mocks en la cima**: `vi.mock` antes de los imports, para que el módulo mockeado esté disponible al cargar las dependencias
- **Sin acoplamiento a implementación**: los tests comprueban entradas/salidas, no detalles internos

---

**Fin del plan de migración.**
