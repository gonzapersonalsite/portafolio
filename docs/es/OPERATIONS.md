# 🛠️ Guía de Operaciones

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../LICENSE)

🇺🇸 [English](../OPERATIONS.md) | **🇪🇸 Español**

Este documento cubre la infraestructura, el pipeline de despliegue, la configuración de entorno y el desarrollo local del proyecto Portafolio.

---

## ☁️ Infraestructura y Despliegue

El proyecto es **solo estático**: un único despliegue, cero servidores.

### Proveedor Cloud
- **Hosting del Frontend:** [Vercel](https://vercel.app) (optimizado para aplicaciones React/Vite), directorio raíz `frontend/`.

### 🚀 Pipeline CI/CD
- **Frontend (Vercel):**
  - Vercel despliega automáticamente en cada push a `main` desde el directorio `frontend/`.
  - Vercel detecta pnpm automáticamente mediante el campo `packageManager` de `package.json`.
  - GitHub Actions ejecuta typecheck + lint + tests + build de producción en push/PR que toquen `frontend/**` como puerta de calidad.
  - Variable de entorno requerida en Vercel: `PNPM_APPROVE_BUILDS=true` (requisito de seguridad de pnpm). El repo declara la misma aprobación para instalaciones locales/CI en `frontend/.npmrc` (`only-built-dependencies[]=esbuild`) y `frontend/pnpm-workspace.yaml` (`allowBuilds`/`onlyBuiltDependencies`).
  - Panel de Vercel: Install Command `pnpm install` y Build Command `pnpm run build`.

Detalles del pipeline:
- Workflow: `.github/workflows/frontend-ci.yml`

---

## 🔧 Configuración de Entorno

### Frontend
- `VITE_EMAILJS_SERVICE_ID`: identificador del servicio de EmailJS.
- `VITE_EMAILJS_TEMPLATE_ID`: identificador de la plantilla de EmailJS.
- `VITE_EMAILJS_PUBLIC_KEY`: clave pública de EmailJS.
- `PNPM_APPROVE_BUILDS`: valor `true` en Vercel para permitir los scripts de build de esbuild (requisito de pnpm). La aprobación en el repo vive en `frontend/.npmrc` y `frontend/pnpm-workspace.yaml`.

Desarrollo local: coloca las tres variables `VITE_EMAILJS_*` en `frontend/.env.local` (gitignored; las claves esperadas están documentadas en `frontend/.env.example`). Vercel mantiene los valores de producción en el panel del proyecto.

---

## 🛠️ Desarrollo Local

### Inicio Rápido
```bash
cd frontend
pnpm install
pnpm dev
```

### Puertas de Calidad
```bash
pnpm lint     # ESLint: reglas FSD + TS
pnpm test     # Vitest: unit + integridad del contenido
pnpm build    # Compilación TypeScript + build de producción con Vite
```

`pnpm build` también alimenta `pnpm preview`, que sirve el bundle de producción en local. Un hook de Husky en pre-commit (`.husky/pre-commit`, instalado por el script `prepare` al hacer `pnpm install`) ejecuta `lint-staged`: ESLint sobre los ficheros `*.ts`/`*.tsx` en stage.

---

## 🧠 Gestión de Contenido

No hay CMS ni panel de administración. Todo el contenido es **JSON estático + imágenes autohospedadas**, editado directamente en el repositorio. Cada push a `main` despliega automáticamente vía Vercel.

### 1. Editar contenido

El contenido vive en `frontend/src/entities/<entidad>/api/data.json`:

| Contenido | Fichero | Notas |
|---|---|---|
| Perfil | `entities/profile/api/data.json` | campos bilingües (`titleEn`/`titleEs`, …) |
| Proyectos | `entities/project/api/data.json` | ordenado por `order` asc; el flag `featured` controla la parrilla de inicio |
| Habilidades | `entities/skill/api/data.json` | ordenado por `order` asc; `level` 0–100 |
| Experiencia | `entities/experience/api/data.json` | ordenado por `endDate` DESC (sin fecha primero), luego `startDate` DESC; omitir `endDate` en puestos actuales |
| Idiomas | `entities/spoken-language/api/data.json` | ordenado por `order` asc |

**Añadir un proyecto:** añade un objeto al array de proyectos con `id` (slug), textos bilingües, `technologies`, `imageUrls`, `imageUrlsFull`, `githubUrl`/`liveUrl`, `type`, `featured` y el siguiente valor de `order`. `imageUrls` e `imageUrlsFull` deben tener la misma longitud, y cada fichero referenciado debe existir en `public/images/projects/<slug>/`.

**Texto enriquecido:** las descripciones pueden guardar saltos de línea como secuencias literales `\n` y listas como líneas que empiezan por `●` (también `•`, `*`, `◦`, `▪`, `-`). `src/shared/lib/richText.ts` normaliza ambas convenciones para la UI y los twins markdown generados.

### 2. Añadir imágenes

Cada imagen de proyecto se guarda en **dos variantes WebP** bajo `frontend/public/images/projects/<slug>/`:
- `<nombre>-800.webp` — usada por las tarjetas de proyecto y las miniaturas de la galería (`imageUrls`)
- `<nombre>-full.webp` — usada por el lightbox a pantalla completa (`imageUrlsFull`)

Genéralas desde cualquier imagen de origen con `sharp-cli`:

```bash
npx -y sharp-cli@5 -i origen.png -o "public/images/projects/<slug>/{name}-800.webp"  resize 800 -q 82
npx -y sharp-cli@5 -i origen.png -o "public/images/projects/<slug>/{name}-full.webp" -q 82
```

`npx -y` descarga y ejecuta `sharp-cli`; úsalo solo con imágenes de origen propias y de confianza. Reglas: solo WebP, calidad ~82, sin hosts de imágenes externos. La foto de perfil vive en `images/profile/`; la vista previa social es `public/og-cover.jpg` (1200×630 JPEG, regenerar cuando haga falta).

**Inmutabilidad de caché:** Vercel sirve `/assets/*`, `/images/*` y `/favicon.ico` con `Cache-Control` immutable de 1 año. Vite pone hash en los nombres de JS/CSS, así que se refrescan en cada build; los nombres de imágenes no. Si reemplazas el contenido de una imagen, **renombra el fichero** (sube su prefijo numérico, p. ej. `00-` → `01-`) y actualiza `data.json`; de lo contrario los visitantes recurrentes verán la imagen antigua hasta un año. `index.html` siempre se revalida, así que cada despliegue se ve al instante.

### 3. Verificar

```bash
cd frontend
pnpm test    # los tests de integridad de datos FALLAN si falta una imagen, hay URLs externas, las listas de imágenes no coinciden o se rompe el contrato/orden
pnpm lint
pnpm build
```

### 4. Publicar

Haz commit y push a `main` → Vercel despliega automáticamente (GitHub Actions ejecuta typecheck + lint + tests + build de producción como puerta de calidad).

---

## 🚫 Aviso Legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **únicamente con fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No está permitido el uso personal para otros portafolios.**
- Consulta el archivo [LICENSE](../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**
*Full Stack Developer | Software Engineering & Innovation*
