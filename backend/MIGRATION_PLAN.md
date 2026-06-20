# Plan de Migración a Arquitectura Hexagonal Estricta

Este documento define el plan estructurado y secuencial para migrar el backend actual (`portfolio-backend`) hacia la plantilla `spring-boot-hexagonal-template`. 

**Reglas Absolutas para todas las fases:**
1. **Zero Lombok:** No se usará Lombok en el nuevo código. Las clases migradas usarán Records o constructores explícitos.
2. **Dominio Puro:** La capa `domain` no tendrá dependencias de Spring, JPA, Jackson ni ninguna otra librería externa. Solo Java puro.
3. **Mapeo Explícito:** Las entidades JPA (`@Entity`) vivirán EXCLUSIVAMENTE en `infrastructure/adapter/out/persistence`. Se requieren mappers para convertirlas a modelos de dominio.
4. **ArchUnit:** Todo código migrado debe cumplir con los tests de arquitectura.

---

## FASE 1: Preparación del Entorno, CI y Reglas (Contrato Arquitectónico) [COMPLETADA]
**Objetivo:** Establecer las bases, inyectar el "contrato" de la template y asegurar que el monorepo valide tanto frontend como backend.
- **Acciones:**
  1. Eliminar la carpeta `.agents` y archivos de IA actuales en el backend (si existen).
  2. Copiar la carpeta `.agents` y `AGENTS.md` de la plantilla al monorepo/backend para forzar la skill `spring-hexagonal-maintainer`. Esto garantiza que los agentes respeten la prohibición de Lombok y el uso de Records.
  3. Modificar `backend/build.gradle` para añadir la dependencia de `ArchUnit`.
  4. Copiar el archivo `ArchitectureTest.java` de la plantilla y adaptarlo al paquete base `com.gonzalomartinez.portfolio_backend`. Esto materializa el contrato: si se viola la regla de capas, el test fallará.
  5. Configurar `ArchitectureTest` para que aplique inicialmente solo a los nuevos paquetes refactorizados.
  6. **Husky Compartido (Monorepo):** Modificar `.husky/pre-commit` en la raíz para que ejecute los checks del frontend (`pnpm lint-staged`) y luego ejecute los checks del backend (`./gradlew test`). Como ArchUnit es un test de JUnit, correrá automáticamente.
  7. **Pipeline CI:** Verificar que `.github/workflows/backend-ci.yml` ejecuta `./gradlew test`. No requiere cambios estructurales, ya que al añadir ArchUnit, la pipeline validará automáticamente la arquitectura en cada push.

## FASE 2: Módulo `User` y `Auth` (El núcleo de seguridad) [COMPLETADA]
**Objetivo:** Migrar la gestión de usuarios, tokens de reseteo de contraseña y la autenticación.
- **Ámbito:** `User`, `PasswordResetToken`, `AuthController`, `AuthenticationService`, `JwtService`.
- **Acciones:**
  1. Crear estructura: `user/domain`, `user/application`, `user/infrastructure`.
  2. **Domain:** Crear `User` (Record/Clase inmutable), `UserRepositoryPort`.
  3. **Application:** Crear `UserUseCase` (interfaz), `AuthService` (implementación de caso de uso).
  4. **Infrastructure:** Crear `UserEntity` (JPA), `JpaUserRepositoryAdapter`, `AuthController` y mover lógica JWT a `infrastructure/security`.
  5. Eliminar clases legacy reemplazadas. Verificar que compila y ArchUnit pasa.

## FASE 3: Módulo `Profile` (Información Personal) [COMPLETADA]
**Objetivo:** Aislar el contexto del perfil del usuario.
- **Ámbito:** `Profile`, `ProfileService`, `ProfileController` (dentro de `PublicController`).
- **Acciones:**
  1. Crear estructura: `profile/domain`, `profile/application`, `profile/infrastructure`.
  2. **Domain:** Crear modelo `Profile` puro y `ProfileRepositoryPort`.
  3. **Application:** Crear casos de uso para leer/actualizar perfil (`GetProfileUseCase`, `UpdateProfileUseCase`).
  4. **Infrastructure:** Crear `ProfileEntity` (JPA), adaptador de base de datos y endpoints REST en `ProfileController`.
  5. Limpiar legacy y verificar tests.

## FASE 4: Módulo `Project` (Portafolio de Proyectos) [COMPLETADA]
**Objetivo:** Migrar la gestión de proyectos.
- **Ámbito:** `Project`, `ProjectType`, `ProjectService`.
- **Acciones:**
  1. Crear estructura: `project/domain`, `project/application`, `project/infrastructure`.
  2. **Domain:** Modelar `Project` puro sin anotaciones. Definir puertos.
  3. **Application:** Casos de uso (CRUD de proyectos).
  4. **Infrastructure:** `ProjectEntity`, repositorios JPA, controladores.
  5. Limpiar legacy y verificar tests.

## FASE 5: Módulo `Experience` (Trayectoria Laboral/Educativa) [COMPLETADA]
**Objetivo:** Migrar la gestión de experiencias.
- **Ámbito:** `Experience`, `ExperienceService`.
- **Acciones:**
  1. Crear estructura: `experience/domain`, `experience/application`, `experience/infrastructure`.
  2. **Domain:** Modelo y puertos puros.
  3. **Application:** Casos de uso CRUD.
  4. **Infrastructure:** `ExperienceEntity`, adaptador JPA, controladores.
  5. Limpiar legacy y verificar tests.

## FASE 6: Módulo `Skill` y `SpokenLanguage` (Habilidades y Formación) [COMPLETADA]
**Objetivo:** Migrar entidades menores de catálogo.
- **Ámbito:** `Skill`, `SpokenLanguage`, sus servicios y repositorios.
- **Acciones:**
  1. Crear estructuras: `skill/...` y `language/...`.
  2. **Domain:** Modelos puros.
  3. **Application:** Casos de uso.
  4. **Infrastructure:** Entidades JPA, adaptadores y controladores REST.
  5. Limpiar legacy y verificar tests.

## FASE 7: Shared, Infraestructura Transversal y Limpieza Final [COMPLETADA]
**Objetivo:** Migrar configuraciones globales, manejo de excepciones y eliminar dependencias viejas.
- **Ámbito:** `infrastructure/config`, `infrastructure/email`, `infrastructure/security` (Rate Limiting, Filtros), Excepciones globales.
- **Acciones:**
  1. Mover configuraciones transversales a una carpeta `shared/infrastructure`.
  2. Refactorizar el envío de emails (`ResendEmailService`) para que implemente un puerto de salida `EmailSenderPort` en `shared/application` o dentro del módulo de `user`.
  3. Eliminar por completo los paquetes legacy (`com.gonzalomartinez.portfolio_backend.domain`, `.application`, `.infrastructure` antiguos).
  4. **Eliminar Lombok** del `build.gradle` completamente.
  5. Asegurar que los tests de ArchUnit corran sobre TODO el proyecto.

---
**Nota para el Agente IA:** Al ejecutar cada fase, procesa los pasos 1 a 5 estrictamente. No inicies la siguiente fase sin que el código de la fase actual compile, pase ArchUnit, y sin confirmación del usuario.
