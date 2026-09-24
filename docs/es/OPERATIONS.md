# 🛠️ Guía de operaciones

[![License: Evaluation Only](https://img.shields.io/badge/License-Evaluation--Only-red)](../../LICENSE)

🇺🇸 [English](../../OPERATIONS.md) | **🇪🇸 Español**

Este documento cubre la infraestructura, el pipeline de despliegue, la configuración de entorno y el desarrollo local del proyecto Portafolio.

---

## ☁️ Infraestructura y despliegue

El proyecto es **solo estático**: un único despliegue, cero servidores.

### Proveedor cloud
- **Hosting del frontend:** [Vercel](https://vercel.com) (optimizado para aplicaciones React/Vite), directorio raíz `frontend/`.

### 🚀 Pipeline CI/CD
- **Frontend (Vercel):**
  - Vercel despliega automáticamente en cada push a `main` desde el directorio `frontend/`.
  - Vercel detecta pnpm por `pnpm-lock.yaml`; después pnpm cambia a la versión fijada en el campo `packageManager` de `frontend/package.json` (el log del build muestra qué versión se ejecutó).
  - GitHub Actions ejecuta lint, tests y `pnpm build` (comprobación de tipos + build de producción) en push/PR que toquen `frontend/**`. No bloquea el despliegue de Vercel: el build propio de Vercel (`tsc -b && vite build`) detiene un despliegue ante errores de tipos o de build, pero un fallo de lint o de tests solo aparece como un check fallido, así que ejecuta `pnpm lint && pnpm test` antes de hacer push. El workflow corre en `ubuntu-24.04` con permisos de solo lectura, y sus actions están fijadas por SHA de commit completo con la versión en un comentario. Para actualizar una action, resuelve la nueva etiqueta con `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` (una etiqueta anotada apunta a un objeto tag: síguelo hasta el commit) y cambia el SHA y el comentario a la vez.
  - El script de instalación de esbuild se aprueba en el repo con `allowBuilds: { esbuild: true }` en `frontend/pnpm-workspace.yaml`, el ajuste de aprobación de builds de pnpm 11 y posteriores; el script de instalación de cualquier otra dependencia sigue bloqueado. Vercel no necesita configuración extra y CI instala con `--ignore-scripts`. `frontend/.npmrc` (`only-built-dependencies[]=esbuild`) y la lista `onlyBuiltDependencies` de `pnpm-workspace.yaml` son ajustes de pnpm 10 que pnpm 11+ ignora: solo se mantienen hasta que un log de build de Vercel confirme que la instalación usa el pnpm fijado, y entonces se borran los dos.
  - Panel de Vercel: Install Command `pnpm install` y Build Command `pnpm run build`.

Detalles del pipeline:
- Workflow: `.github/workflows/frontend-ci.yml`

### 🌐 Configuración del hosting (`frontend/vercel.json`)
- **Sin rewrites:** cada ruta es un fichero HTML propio. Cualquier otra dirección, incluido un asset o una imagen que no existen, recibe `404.html` con estado 404 (la app de esa página lleva al visitante al inicio). No hay `/favicon.ico`: las páginas enlazan los iconos de `/icons/`.
- **Cabeceras de seguridad:** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y `Permissions-Policy` en cada respuesta. La CSP permite scripts del propio sitio más el script de tema incrustado en `index.html` (por su hash `sha256`), estilos en línea (Emotion), imágenes y fuentes solo del propio sitio y peticiones de red solo a EmailJS.
  - Si editas el script incrustado en `index.html`, `pnpm test` falla e imprime su nuevo valor `'sha256-…'`: ponlo en la CSP.
  - Un servicio de terceros nuevo (analítica, fuentes, embeds) necesita su host en la directiva de la CSP que corresponda o el navegador lo bloquea. La barra de herramientas de Vercel también queda bloqueada, solo en los despliegues de preview.
- **Caché:** `/assets/*`, `/images/*` y `/icons/*` son inmutables durante un año (ver *Inmutabilidad de caché* más abajo); `index.html` siempre se revalida.
- **Copias markdown** (`*.md`): se sirven con `X-Robots-Tag: noindex`; los agentes las leen y los buscadores indexan las páginas HTML.
- **Tras un despliegue**, comprueba con `curl -I`: `/about` y `/projects/` devuelven 200 con su propio `<title>`; `/nope` y `/assets/nope.js` devuelven 404; `/about/index.md` lleva `X-Robots-Tag: noindex`; `/icons/gonzalo-dev.svg` lleva el `Cache-Control` inmutable; todas las respuestas llevan `Content-Security-Policy`.

---

## 🔧 Configuración de entorno

### Frontend
- `VITE_EMAILJS_SERVICE_ID`: identificador del servicio de EmailJS; debe empezar por `service_` (con cualquier otro valor el formulario indica que el contacto no está configurado; ver `frontend/src/features/contact-form/api/contactApi.ts`).
- `VITE_EMAILJS_TEMPLATE_ID`: identificador de la plantilla de EmailJS.
- `VITE_EMAILJS_PUBLIC_KEY`: clave pública de EmailJS.

Desarrollo local: coloca las tres variables `VITE_EMAILJS_*` en `frontend/.env.local` (gitignored; las claves esperadas están documentadas en `frontend/.env.example`). Vercel mantiene los valores de producción en el panel del proyecto. Ya nada lee `VITE_API_BASE_URL` ni `PNPM_APPROVE_BUILDS`: si siguen en el panel de Vercel, bórralas.

---

## 🛠️ Desarrollo local

### Inicio rápido
```bash
cd frontend
pnpm install
pnpm dev
```

El servidor de desarrollo solo escucha en `localhost`; ejecuta `pnpm dev --host` para abrirlo desde un móvil en la misma red. También sirve `llms.txt`, `robots.txt`, `sitemap.xml` y las copias markdown; los shells HTML por ruta (títulos, canonical, JSON-LD) y `404.html` solo existen en la salida del build.

`pnpm install` ejecuta solo los scripts de instalación de dependencias aprobados en `pnpm-workspace.yaml` (esbuild) y después el script `prepare` del proyecto, que instala el hook de Git descrito abajo. Con `pnpm install --ignore-scripts` no se ejecuta nada; `pnpm run prepare` instala el hook después.

### Puertas de calidad
```bash
pnpm lint     # ESLint: reglas FSD + TS
pnpm test     # Vitest: unit + integridad del contenido
pnpm build    # Compilación TypeScript + build de producción con Vite
```

`pnpm build` también alimenta `pnpm preview`, que sirve el bundle de producción en local; abre el shell de una ruta en su dirección con barra final (p. ej. `/about/`). Un hook de Husky en pre-commit (`.husky/pre-commit`, instalado por el script `prepare`) ejecuta `lint-staged`: ESLint sobre los ficheros `*.ts`/`*.tsx` en stage.

---

## 🧠 Gestión de contenido

No hay CMS ni panel de administración. Todo el contenido es **JSON estático + imágenes autohospedadas**, editado directamente en el repositorio. Cada push a `main` despliega automáticamente vía Vercel.

Las rutas de esta sección son relativas a `frontend/`.

### 1. Editar contenido

El contenido vive en `src/entities/<entidad>/api/data.json`:

| Contenido | Fichero | Notas |
|---|---|---|
| Perfil | `src/entities/profile/api/data.json` | campos bilingües (`subtitleEn`/`subtitleEs`, …); `alternateName` (el nombre legal completo) solo alimenta el JSON-LD |
| Proyectos | `src/entities/project/api/data.json` | ordenado por `order` asc; el flag `featured` controla la parrilla de inicio |
| Habilidades | `src/entities/skill/api/data.json` | ordenado por `order` asc; `level` 0–100; `category` es una de `SKILL_CATEGORY_ORDER` (`src/entities/skill/model/categories.ts`, que además fija el orden de los grupos en la página de habilidades); una categoría nueva necesita también su etiqueta en `skills.categories` (`src/shared/config/i18n.ts`, EN y ES) y en `tooling/agent-files/labels.ts`; los tests exigen las tres. Las *Competencias principales* (página Sobre mí, su copia markdown y el `knowsAbout` del JSON-LD) son las habilidades de Frontend, Backend, Database, Mobile y Desktop con `level` ≥ 70 (`getCoreSkills`) |
| Experiencia | `src/entities/experience/api/data.json` | ordenado por `endDate` DESC (sin fecha primero), luego `startDate` DESC; omitir `endDate` en puestos actuales; las fechas van en formato `YYYY-MM-DD` y se muestran como mes y año (`mar 2025 – jun 2025`) |
| Idiomas | `src/entities/spoken-language/api/data.json` | ordenado por `order` asc |

**Añadir un proyecto:** añade un objeto al array de proyectos con `id` (slug), textos bilingües, `technologies`, `images`, `links`, `type`, `featured` y el siguiente valor de `order`. Para colocarlo en otra posición, insértalo ahí y renumera el `order` de las entradas siguientes: el array debe seguir ordenado por `order`.

- `images` es la galería en orden; la primera es la portada de la tarjeta. Cada entrada es `{ "base": "/images/projects/<slug>/<NN>-<nombre>", "fullWidth": <ancho del fichero -full en px>, "altEn": "…", "altEs": "…" }`, donde `<NN>` es su posición en la galería (`00`, `01`, …) y los textos alternativos describen lo que muestra la captura (250 caracteres como máximo; la galería también los muestra como pie de imagen). Los tests comprueban que existen las tres variantes (ver más abajo) y que `fullWidth` coincide con el fichero.
- `links` es la lista de botones de la tarjeta, en orden: `{ "kind": "site" | "download" | "googlePlay" | "repository" | "documentation", "url": "https://…" }`. `site`, `download` y `googlePlay` son principales (botones rellenos; `llms.txt` usa el primer enlace principal); `repository` y `documentation` son secundarios. No enlaces un repositorio privado, que sería una página que los visitantes no pueden abrir, e indica en la descripción que el código fuente es privado.
- **Nuevo tipo de enlace** (p. ej. un botón de App Store): añádelo a `PROJECT_LINK_KINDS` en `src/entities/project/model/projectLinks.ts` (clave de etiqueta y énfasis), su etiqueta en `projects.links` de `src/shared/config/i18n.ts` (EN y ES, en español solo con la primera letra en mayúscula), su etiqueta de copia markdown en `tooling/agent-files/labels.ts` y su icono en `LINK_ICONS` (`src/entities/project/ui/ProjectCard.tsx`). TypeScript y `labels.test.ts` fallan hasta que existen los cuatro; la lógica de la tarjeta no cambia.

**Descripción en la tarjeta:** la tarjeta muestra el primer párrafo y un botón *Leer más* para el resto, así que el primer párrafo debe explicar por sí solo qué es el proyecto y con qué está hecho.

**Texto enriquecido:** las descripciones pueden guardar saltos de línea como secuencias literales `\n` y listas como líneas que empiezan por `●` (también `•`, `*`, `◦`, `▪`, `-`). Un `●`, `•`, `◦` o `▪` en mitad de una línea empieza una viñeta nueva; `-` y `*` solo cuentan al principio de la línea, así que "Frontend - React" sigue siendo una sola frase. `src/shared/lib/richText.ts` normaliza ambas convenciones para la UI y las copias markdown generadas.

**Distintivo Disponible:** el hero de inicio y la página de experiencia, y sus copias markdown, muestran *Open to work* / *Disponible* (`common.openToWork` en `src/shared/config/i18n.ts`, `openToWork` en `tooling/agent-files/labels.ts`). No es un campo de datos: para dejar de mostrarlo, quita el `StatusBadge` de `src/pages/home/ui/HomePage.tsx` y `src/pages/experience/ui/ExperiencePage.tsx` y las llamadas a `openToWorkLine` de `tooling/agent-files/twins.ts`, y actualiza `twins.test.ts`.

**Enlaces en español:** la web tiene un único juego de URLs; añade `?lang=es` (o `?lang=en`) a la dirección de cualquier página para compartirla en ese idioma, p. ej. `https://mi-portafolio-gonzalo.vercel.app/about?lang=es`. El idioma queda guardado para ese visitante igual que si lo hubiera elegido en el menú, y el parámetro desaparece de la dirección.

### 2. Añadir imágenes

Cada imagen de proyecto se guarda en **tres variantes WebP** (calidad 82) bajo `public/images/projects/<slug>/`, todas con el nombre `base` que figura en `data.json`:
- `<nombre>-thumb.webp` — 160 px de ancho, usada por la tira de miniaturas de la galería
- `<nombre>-800.webp` — 800 px de ancho, usada por la portada de la tarjeta de proyecto
- `<nombre>-full.webp` — tamaño original, usada por la galería a pantalla completa y, en pantallas de alta densidad, por la portada de la tarjeta (`srcset`)

Genéralas con `ffmpeg` compilado con libwebp (no se descarga nada), con un nombre de salida que indique la posición en la galería y el contenido:

```bash
cd frontend
src=ruta/a/captura.png                                   # tu propia imagen de origen
out=public/images/projects/<slug>/NN-<slug>_<descripcion>
ffmpeg -i "$src" -vf "scale='min(160,iw)':-2:flags=lanczos" -c:v libwebp -quality 82 "$out-thumb.webp"
ffmpeg -i "$src" -vf "scale='min(800,iw)':-2:flags=lanczos" -c:v libwebp -quality 82 "$out-800.webp"
ffmpeg -i "$src" -c:v libwebp -quality 82 "$out-full.webp"
```

Nunca se amplía: `min(…, iw)` mantiene un origen más estrecho en su propio ancho, así que un origen de 800 px de ancho o menos da un fichero `-800` del mismo tamaño que el `-full` (los tests comprueban el ancho de cada variante frente a `fullWidth`). Anota el ancho del fichero `-full` como `fullWidth`.

- **Portadas:** la tarjeta muestra la portada en 16:9 (`PROJECT_COVER_RATIO`) y los tests exigen exactamente esa proporción en las tres variantes. Recorta una captura real a su contenido, o amplíala con filas de su propio fondo liso cuando se quede corta; nunca incluyas la interfaz del navegador en una captura, y deja los logotipos para la galería, no para la portada.
- **Sin restos:** los tests fallan con cualquier fichero de `public/images/projects/` que ningún proyecto muestre, así que borra las variantes antiguas al sustituir o quitar una imagen.
- **Otras imágenes:** solo WebP (calidad 82 para las capturas, 85 para la foto de perfil), sin hosts de imágenes externos. La foto de perfil vive en `public/images/profile/` y su fallback es `public/profile-fallback.webp`.
- **Vista previa social:** `public/og-cover-typographic.jpg` (JPEG de 1200×630, calidad 85; los crawlers sociales rechazan WebP): el logotipo GONZALO.DEV, el nombre, el puesto y el stack principal en Inter sobre el degradado oscuro del hero, sin foto, renderizada desde una página HTML en Edge headless. `index.html` la enlaza desde `og:image` y `twitter:image` con una ruta relativa a la raíz (el build la hace absoluta) y la describe en `og:image:alt` y `twitter:image:alt`. Las redes sociales guardan en caché las vistas previas por URL, así que una imagen cambiada lleva un nombre de fichero nuevo; tras el despliegue, refresca las vistas previas con LinkedIn Post Inspector y Facebook Sharing Debugger.
- **Iconos:** el monograma GONZALO.DEV en `public/icons/`: `gonzalo-dev.svg` (el que prefieren los navegadores), `gonzalo-dev.ico` (16, 32 y 48 px) y `gonzalo-dev-180.png` (icono apple-touch). Un icono cambiado lleva nombres de fichero nuevos y enlaces nuevos en `index.html`; `pnpm test` comprueba que existe cada icono e imagen social que enlaza `index.html`.

**Inmutabilidad de caché:** Vercel sirve `/assets/*`, `/images/*` y `/icons/*` con `Cache-Control` immutable de 1 año. Vite pone hash en los nombres de JS/CSS, así que se refrescan en cada build; los nombres de imágenes e iconos no. Si reemplazas el contenido de una imagen, **renombra el fichero** (conserva su prefijo numérico, que es la posición en la galería, y cambia la parte descriptiva, p. ej. `02-developer-site_quotidia` → `02-developer-site_quotidia-gallery`; renombra juntas las variantes `-thumb`, `-800` y `-full` para que compartan nombre base) y actualiza `base` en `data.json`; de lo contrario los visitantes recurrentes verán la imagen antigua hasta un año. `index.html` siempre se revalida, así que cada despliegue se ve al instante.

### 3. Verificar

```bash
cd frontend
pnpm test    # los tests de integridad de datos FALLAN si falta una variante de imagen, su ancho no cuadra o no se usa, una portada no es 16:9, hay un texto alternativo o un enlace no válido, o se rompe el contrato/orden
pnpm lint
pnpm build
```

### 4. Publicar

Haz commit y push a `main` → Vercel despliega automáticamente; GitHub Actions informa en paralelo de lint, tests y el build de producción con comprobación de tipos (no retiene el despliegue).

---

## 🚫 Aviso legal

**© 2026 Gonzalo Martínez García. Todos los derechos reservados.**

Este software es **propietario** y se proporciona **únicamente con fines de evaluación**.
- **Queda estrictamente prohibida la copia**, modificación, distribución o uso no autorizado de este software por cualquier medio.
- **No está permitido el uso personal para otros portafolios.**
- Consulta el archivo [LICENSE](../../LICENSE) para los términos y condiciones completos.

---

**Desarrollado por Gonzalo Martínez García**
*Desarrollador Full Stack junior | Ingeniería de software e innovación*
