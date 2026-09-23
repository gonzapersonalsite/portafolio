# 🧊 Plan de Migración — Portafolio Estático (sin backend)

**Estado:** COMPLETADO — documento histórico (cierre 2026-09-23)
**Resultado:** migración mergeada en `main` (commit `8ebdbc4`); el tag `pre-static-migration` conserva el estado full-stack anterior.
**Reglas de ejecución (histórico):**
- NO se hacía commit ni push durante la ejecución (solo al final, si el propietario lo decidía).
- El plan podía modificarse durante la marcha **solo si había justificación**; cada cambio se registró en la sección "Modificaciones durante la ejecución".

---

## Objetivo

Eliminar el backend (Render) y la base de datos (Aiven) para acabar con la dependencia de planes gratuitos y reducir coste, **manteniendo el cliente visual exactamente igual**. El contenido pasa a JSON estático versionado dentro del repo, las imágenes se autohospedan, y el único servicio externo restante es EmailJS (formulario de contacto).

---

## Situación actual verificada

### Frontend (`frontend/`)
- React 19 + TypeScript + Vite 7 + MUI 7 + React Router 7 + Zustand 5 + axios + i18next + EmailJS. Arquitectura FSD estricta (`frontend/AGENTS.md`).
- El sitio público solo consume **6 endpoints GET públicos**:
  | Endpoint | Función actual | Fichero |
  |---|---|---|
  | `GET /public/projects` | `getAllProjects` | `src/entities/project/api/projectApi.ts:4` |
  | `GET /public/projects/featured` | `getFeaturedProjects` | `src/entities/project/api/projectApi.ts:9` |
  | `GET /public/profile` | — | `src/entities/profile/api/profileApi.ts` |
  | `GET /public/skills` | — | `src/entities/skill/api/skillApi.ts` |
  | `GET /public/experiences` | — | `src/entities/experience/api/experienceApi.ts` |
  | `GET /public/spoken-languages` | — | `src/entities/spoken-language/api/languageApi.ts` |
- El resto (auth JWT, admin CRUD, panel) es código que quedará muerto: `entities/user/**`, `features/auth/**`, `features/*-crud/**`, `features/profile-editor/**`, `widgets/dashboard-layout/**`, `pages/admin/**`, rutas `/admin/*` en `src/app/routing/AppRouter.tsx`, botón admin en `widgets/navbar/ui/Navbar.tsx`.
- Los datos de servidor NO viven en stores: se obtienen por página vía `useApiData` (`src/shared/lib/useApiData.ts`) con caché localStorage (`src/shared/lib/requestCache.ts`, TTL 24h), cliente axios con adapter propio (`src/shared/api/client.ts`), interceptores (`src/app/api/interceptors.ts`) y aviso de arranque en frío vía `src/shared/lib/notificationEvents.ts`.
- **No existe integración con la API de GitHub Releases**; `githubUrl`/`liveUrl` son simples campos de texto/enlace.

### Contenido en producción (dump `backend/backups/backup_20260911_063742.sql`, Aiven, 2026-09-11)
- 1 perfil (`profiles`), 5 proyectos (`projects`), 33 skills (`skills`), 4 experiencias (`experiences`), 3 idiomas hablados (`spoken_languages`), 1 usuario admin (`users`, **no se migra**). Instantánea histórica: hoy el repo contiene 6 proyectos (se añadió `developer-site`).
- `project_technologies` y `experience_technologies` contienen duplicados (mismo valor repetido hasta 20 veces) → hay que deduplicar preservando el orden de primera aparición.
- 21 URLs de imágenes de proyectos en `project_images`, todas en `i.postimg.cc`. El perfil tiene foto y CV enlazados a Google Drive.
- Los textos usan `\n` (backslash-n literal, escapado como `\\n` en el dump) para saltos de línea; el frontend los renderiza con `RichTextRenderer`.

### Imágenes y fallback
- No hay URLs externas hardcodeadas en código; vienen del API. `formatImageUrl` (`src/shared/lib/imageUtils.ts:6-32`) reescribe URLs de Google Drive a thumbnails.
- Fallback actual: `ImageWithFallback` (`src/shared/ui/ImageWithFallback.tsx:36-43`) → perfil usa `/profile-fallback.jpg` local; el resto usa `https://placehold.co/600x400?text=No+Image` (externo, a eliminar).
- Problema de producción actual: certificado SSL caducado en `i.postimg.cc` (`ERR_CERT_DATE_INVALID`) + un timeout en `kanban-board.png`.

### Infraestructura y CI/CD (verificado)
- Vercel (frontend, root dir `frontend/`), Render (backend, deploy solo vía hook), Aiven (PostgreSQL 17).
- `frontend/vercel.json:3-6` → rewrite `/api/(.*)` a `https://portafolio-9uob.onrender.com/api/$1` + bloque de headers `/api` no-store (`:41-48`).
- `frontend/vite.config.ts:39-44` → proxy dev `/api` → `VITE_API_TARGET`/`localhost:8080`.
- `.github/workflows/backend-ci.yml` → tests Gradle + POST al hook de Render (secret `RENDER_DEPLOY_HOOK_URL`).
- `.github/workflows/frontend-ci.yml` → pnpm install + `tsc -b` + lint + test. Sin cambios salvo los derivados del refactor.
- `docker-compose.yml` → levanta database (postgres:16) + backend (Dockerfile) en local. `frontend/Dockerfile` + `frontend/nginx.conf` también existen y sobran.
- `.gitignore:12-15` → `*.sql`, `backup.sql`, `backend/backups/*` (el dump NO está versionado).
- `tsconfig.app.json:11` → `resolveJsonModule: true` ya activo (imports de JSON funcionan sin tocar config).

### Decisiones de diseño de la migración
- **Contenido estático**: un JSON por entidad en el segmento `api/` de cada slice (`entities/<entidad>/api/data.json`), leído por funciones con los **mismos nombres públicos** (`getAllProjects()`, etc.) → diff mínimo en páginas, FSD intacto (el segmento `api/` pasa a ser "acceso a datos").
- **IDs**: los UUID pasan a **slugs** legibles (`pokedex`, `kanban-board`, …).
- **`useApiData`** se sustituye por un hook síncrono nuevo (`shared/lib/useContent.ts`); `loading`/`error` desaparecen (los datos son parte del bundle).
- **EmailJS se mantiene** (contacto sin backend). i18n, temas light/dark/glass, FSD, lazy loading y el easter-egg de versión del Footer se mantienen.

---

## Fases

### Fase 0 — Resguardo y seguridad (precondiciones)
- [x] Backup de producción actualizado: `backend/backups/backup_20260911_063742.sql` (61.7 KB, 2026-09-11).
- [x] Copiar el dump a una ubicación externa al repo: `_backups/portafolio/` (fuera del repo; sobrevive al borrado de `backend/`).
- [x] Crear rama `refactor/static-migration` y tag `pre-static-migration` apuntando al HEAD actual de `main` (rollback garantizado; no implica commit).
- [x] Comprobar descargabilidad de las 21 imágenes de postimg.cc → verificable con `curl -k` (cert caducado ignorado). Todas las muestras responden 200. Se descargan en Fase 2.

### Fase 1 — Extracción de datos del dump → JSON estático
- [x] Script de extracción **desechable** (Node, sin dependencias, en carpeta temporal fuera del repo) que parsea los bloques `COPY … FROM stdin;` del `.sql` (formato: tab-separado, `\N` = NULL, `\\` = `\`, `\.` = fin) y genera los JSON.
- [x] Salidas (una por entidad): `src/entities/profile/api/data.json`, `src/entities/project/api/data.json`, `src/entities/skill/api/data.json`, `src/entities/experience/api/data.json`, `src/entities/spoken-language/api/data.json`.
- [x] Mapeo 1:1 con los tipos TS existentes (`model/types.ts` de cada slice). Campos bilingües En/Es tal cual. `end_date` nulo → `undefined` (experiencia "En búsqueda activa").
- [x] Deduplicar tecnologías preservando orden de primera aparición. Ordenar por `display_order`/`image_order`.
- [x] Slugs: `licence-generator`, `pokedex`, `nutrimanager`, `portfolio`, `kanban-board` (mapeo slug↔UUID explícito en el script).
- [x] `liveUrl` del proyecto Portfolio pasa de `./` a la URL real (Fase 5).
- [x] Verificación: test unitario de esquema (Fase 3) + comparativa visual en `pnpm dev` contra producción.

### Fase 2 — Imágenes autohospedadas
- [x] Descargar las 21 imágenes de proyectos a `frontend/public/images/projects/<slug>/<nombre>.<ext>` con nombres descriptivos y orden por índice (`00-cover.png`, `01-…`, …).
- [x] Descargar la foto de perfil (Google Drive) a `frontend/public/images/profile/`.
- [x] Actualizar los JSON: URLs → rutas locales (`/images/...`).
- [x] Eliminar `formatImageUrl` de los puntos de uso públicos y de `shared/lib/index.ts` (borrado del fichero aplazado a Fase 3: la página admin aún lo importa).
- [x] Fallback local: creado `frontend/public/images/no-image.svg` y sustituido `placehold.co` en `ImageWithFallback.tsx:42`.
- [x] Quitar `referrerPolicy="no-referrer"` de `ProjectCard`.
- [x] Verificación: `grep -r "postimg\|placehold\|drive.google"` en `src/` y JSONs → 0 resultados (excepto CV de Google Drive, que se mantiene como enlace externo deliberado).

### Fase 3 — Refactor frontend a datos estáticos (UI intacta)
- [x] Reescribir los 6 `api/*.ts` de entidades como lectores síncronos de `data.json`, manteniendo nombres y firmas públicas. Eliminar funciones admin de esos ficheros.
- [x] Crear `shared/lib/useContent.ts` (hook síncrono) y sustituir `useApiData` en páginas/`useProfile`. Eliminar ramas `loading`/`error` de las páginas (skeletons/ErrorState ya no se alcanzan).
- [x] Eliminar: `shared/api/client.ts`, `app/api/interceptors.ts`, `shared/lib/requestCache.ts`, `shared/lib/notificationEvents.ts` (y sus tests), aviso "cold start" y su key i18n.
- [x] Eliminar: `entities/user/**`, `features/auth/**`, `features/project-crud/**`, `features/skill-crud/**`, `features/experience-crud/**`, `features/language-crud/**`, `features/profile-editor/**`, `widgets/dashboard-layout/**`, `pages/admin/**`, rutas `/admin/*` y lazy imports en `AppRouter.tsx`, botón admin en `Navbar.tsx`, strings admin en `shared/config/i18n.ts` (verificado con script de escaneo de claves).
- [x] Revisar dependencias: quitados `axios`, `react-hook-form`, `zustand` de `package.json` y lock. `react-hook-form` no lo usaba `ContactForm`.
- [x] Tests: eliminados tests de API/auth/cache; `useProfile.test.ts` reescrito; **añadidos tests de esquema del contenido** (`data.test.ts` por entidad: contrato, orden, imágenes locales existentes vía `import.meta.glob`).
- [x] Actualizado `frontend/.agents/skills/portfolio-conventions/SKILL.md` (modelo de contenido estático).
- [x] Verificación: `pnpm tsc -b`, `pnpm lint`, `pnpm test` (26 tests), `pnpm build` → todo verde.

### Fase 4 — Limpieza del monorepo, CI/CD y configuración
- [x] Eliminar `backend/` completo (historia preservada en git + tag Fase 0).
- [x] Eliminar: `docker-compose.yml`, `frontend/Dockerfile`, `frontend/nginx.conf`, `.env` y `.env.production` raíz. Crear `frontend/.env.local` (gitignored) con las 3 `VITE_EMAILJS_*` para desarrollo local.
- [x] `frontend/vercel.json`: eliminar rewrite `/api` y bloque headers `/api`; conservar SPA rewrite y headers de assets.
- [x] `frontend/vite.config.ts`: eliminar bloque `server.proxy['/api']`.
- [x] `.github/workflows`: eliminar `backend-ci.yml`; `frontend-ci.yml` se mantiene.
- [ ] GitHub (manual por el propietario; externo al repo): eliminar secret `RENDER_DEPLOY_HOOK_URL`.
- [x] Documentación: reescribir `README.md`, `ARCHITECTURE.md`, `OPERATIONS.md`, `docs/es/*` (arquitectura estática, sin Render/Aiven/Swagger/JWT), simplificar `AGENTS.md` raíz (ya no es monorepo) y eliminar `.agents/skills/monorepo-router/`.
- [x] `.gitignore`: limpiar entradas de backups/sql que ya no apliquen.
- [ ] Vercel (manual por el propietario; externo al repo): eliminar env var `VITE_API_BASE_URL`; mantener `PNPM_APPROVE_BUILDS=true`.

### Fase 5 — Reescribir el proyecto "Portfolio" (contenido)
- [x] Nueva descripción EN/ES acorde a la realidad: portafolio estático sin backend, React/TS/FSD, i18n bilingüe, glassmorphism, EmailJS, CI/CD en Vercel, cero infraestructura de servidor.
- [x] `technologies`: `React`, `TypeScript`, `Vite`, `Material UI`, `Feature-Sliced Design`, `i18next`, `EmailJS`, `Vercel`.
- [x] `liveUrl` → `https://mi-portafolio-gonzalo.vercel.app/`; `githubUrl` se mantiene.
- [x] `imageUrls`: se mantienen las capturas existentes (la UI no cambia visualmente; capturas nuevas son opcionales tras desplegar).
- [x] Títulos actualizados (fuera el "dynamic" que aludía al CMS): "Professional portfolio" / "Portafolio profesional".
- [x] Revisar el resto de proyectos por si sus descripciones mencionan infra que haya cambiado → las menciones a Spring Boot/JWT de otros proyectos (Mistertransfer, Globatecnic) son históricas reales; se mantienen.

### Fase 6 — Verificación y corte (cutover)
- [x] Local: `pnpm lint`, `pnpm test` (26 tests en ese momento; hoy 61), `pnpm build` en `frontend/` — cero errores.
- [x] Smoke test del build servido (vite preview): `/` 200 con SEO title correcto, imágenes de proyecto 200 (PNG), fallback `no-image.svg` 200.
- [x] Bundle auditado: cero referencias a `/api`, `postimg`, `placehold`, `onrender`, `axios`; único dominio externo en el bundle: `api.emailjs.com` (permitido por diseño).
- [x] Merge a `main` (commit `8ebdbc4`) → Vercel despliega.
- [ ] Deploy de preview de Vercel (rama) → smoke test en URL de preview (paso externo al repo; quedó cubierto por el merge).
- [ ] Periodo de gracia 1 semana → después: apagar y eliminar servicio Render y base Aiven (paso externo al repo; dump archivado en `_backups/portafolio/`).
- [x] Borrar el script de extracción desechable y artefactos temporales.

### Fase 7 — Extras opcionales (adopciones de developer-site)
- [x] `sitemap.xml` + `robots.txt` (generados en build por `tooling/agent-files`).
- [x] `llms.txt` + twins markdown por página (EN/ES) + shells HTML por ruta con canonical, metadatos y `rel="alternate"`.
- [ ] Dimensiones de imagen en datos para cero CLS (técnica de leer headers).
- [ ] Carpeta `audits/` con evidencia Lighthouse versionada.

---

## Criterio final "nada colgando"

Tras la Fase 6 deben dar 0 resultados en `src/`, configs y docs:
`grep -riE "postimg|placehold|axios|/api|JWT|Render|Aiven|Swagger|admin|Docker|nginx|gradle"`

Criterio histórico: hoy solo sobreviven nombres de tecnologías y descripciones de proyectos dentro del contenido, además del segmento `api/` de las entidades; no queda código de infraestructura.

Quedará: un solo deploy (Vercel), una sola fuente de verdad de contenido (JSON versionado en git), imágenes locales, EmailJS como único externo, dump archivado fuera del repo, tag `pre-static-migration` como rollback.

---

## Modificaciones durante la ejecución

- 2026-09-11: El borrado físico de `imageUtils.ts` (Fase 2) se aplaza a Fase 3, porque `pages/admin/projects/ProjectsManagementPage.tsx` (aún no eliminado) lo importa; así el árbol compila al final de cada fase.
- 2026-09-11: Descargas de postimg.cc con fallos intermitentes (timeouts/SSL); resueltos con reintentos. Las imágenes quedaron completas y verificadas por magic bytes.
- 2026-09-11: `node_modules` del frontend quedó en estado inconsistente tras la primera instalación (fallos en 2 suites de tests no relacionados con el cambio); se resolvió con reinstalación limpia. Verificado además contra el HEAD original en un worktree temporal.
- 2026-09-11: El test de integridad usa `import.meta.glob('/public/images/**')` en lugar de `node:fs` para verificar existencia de imágenes (evita añadir tipos Node al tsconfig de la app).
- 2026-09-11: `vercel.json` gana bloque de headers cache para `/images/(.*)` (immutable) al quedar las imágenes en el mismo deploy.
- 2026-09-11: **Optimización de imágenes (revisión final):** conversión a WebP (q82) con dos variantes por imagen de proyecto (`-800` para tarjetas/miniaturas, `-full` para lightbox) → 11.2 MB → 956 KB (91% menos). Foto de perfil y fallback a WebP; `og-cover.jpg` 1200×630 para crawlers sociales. Reserva de espacio anti-CLS añadida a las fotos de perfil (`aspectRatio="2/3"`) y `loading="lazy"` en portadas de proyecto. `data.json` gana el campo `imageUrlsFull`. Favicon real copiado de developer-site.

## Pasos manuales (externos al repo)

No verificables desde el código; quedan documentados como referencia histórica:

1. **Vercel:** eliminar la variable de entorno `VITE_API_BASE_URL` (mantener `PNPM_APPROVE_BUILDS=true`).
2. **GitHub:** eliminar el secret `RENDER_DEPLOY_HOOK_URL`.
3. **Periodo de gracia:** tras 1 semana con el estático en producción, eliminar el servicio de Render y la base de datos de Aiven (dump archivado en `_backups/portafolio/backup_20260911_063742.sql`).
4. **Opcional:** actualizar capturas del proyecto "Portfolio" si se desea que muestren el sitio nuevo.
