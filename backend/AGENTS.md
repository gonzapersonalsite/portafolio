# AI Agents Context

This project is an **Immutable Backend Template** for microservices and APIs, built with **Modern Java** and **Spring Boot**. 
It strictly enforces **Clean Architecture** and **Hexagonal Architecture** (Ports and Adapters).

## Instructions for AI Assistants
Any AI agent modifying or reading this codebase MUST comply with the rules defined in the architectural skill contract:
👉 See: [`.agents/skills/spring-hexagonal-maintainer/SKILL.md`](./.agents/skills/spring-hexagonal-maintainer/SKILL.md)

### Quick Summary
- **Domain is King**: Pure Java only. No Spring or DB annotations.
- **Records**: Use Java Records for immutability.
- **Zero Lombok**: Do not use Lombok under any circumstances.
- **Strict Layers**: `Infrastructure` -> `Application` -> `Domain`.

---

## Project Conventions (created during setup, kept in a separate skill)

This file and `.agents/skills/spring-hexagonal-maintainer/SKILL.md` define the **base Architectural contract**. They are the template's foundation and **MUST NOT be modified** by any project spawned from this template.

When, during project setup, the developer makes implementation decisions (Database Migration tool, Security framework, API Documentation, Logging strategy, Testing libraries, etc.), you **MUST** create a new skill file:

```
.agents/skills/<project>-conventions/SKILL.md
```

Inside it, document **every convention as an immutable rule** that future AI agents will load and obey. Use the same imperative, non-negotiable tone as this file.

### Why a separate file

- Keeps the base Hexagonal contract clean and auditable.
- Prevents this file from inflating with project-specific rules.
- Allows the project conventions to grow independently without touching template files.
- Future agents load both: the base skill for architecture + the conventions skill for project rules.

### Examples of what belongs in `<project>-conventions/SKILL.md`

```markdown
# <project-name> — Project Conventions

## Database & Migrations
- Flyway is the ONLY migration tool.
- Migrations live in `src/main/resources/db/migration`.
- Entities must use `UUID` for primary keys.

## Security
- Spring Security with JWT.
- JWT Filters are strictly located in `infrastructure/security`.

## Error Handling
- Use `@ControllerAdvice` in `infrastructure/rest/exception`.
- Return a standardized `ApiError` JSON response.
- Domain exceptions must extend `RuntimeException` and be mapped in the ControllerAdvice.

## Testing
- JUnit 5 + Mockito + AssertJ.
- Integration tests use Testcontainers for the database.
```

### Rule

Every time a new implementation decision is made that should be respected across the whole project, **add it to the conventions skill**. Do not wait — do it in the same session. Future agents depend on it.
