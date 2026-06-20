# Portfolio Backend - Project Conventions & Architecture Contract

This document outlines the strict architectural rules and conventions applied to the Portfolio Backend project. It serves as the single source of truth for the codebase structure, ensuring consistency, maintainability, and alignment with Clean Architecture (Strict Hexagonal Architecture) principles.

## 1. Architectural Style: Strict Hexagonal Architecture (Ports & Adapters)

The project is divided into distinct, isolated modules (bounded contexts) by feature (`user`, `experience`, `project`, `skill`, `language`, `profile`, `shared`).
Each module strictly enforces the following layers:

### A. Domain Layer (`domain/`)
- **Purity:** 100% pure Java. Zero framework dependencies (no Spring, no JPA, no Jackson).
- **Immutability:** Entities and value objects are modeled as Java `Record` types. If mutations are needed, methods must return a *new* instance of the record (e.g., `user.withPasswordHash(...)`).
- **Ports (Outbound):** Interfaces defining the contract for infrastructure adapters (e.g., `UserRepositoryPort`).

### B. Application Layer (`application/`)
- **Use Cases:** Contains the business orchestration logic (Services implementing Use Case interfaces).
- **DTOs:** Modeled exclusively as Java `Record` types. Used for cross-layer communication.
- **Validation:** Business rule validation occurs here, while input format validation occurs in the web adapter (using Jakarta Validation on DTOs).

### C. Infrastructure Layer (`infrastructure/`)
- **Adapters (Inbound):** REST Controllers (`adapter/in/web/`) that map HTTP requests to Application DTOs.
- **Adapters (Outbound):** JPA Repositories (`adapter/out/persistence/`) implementing Domain Ports.
- **JPA Entities:** Mapped explicitly and completely isolated from the Domain. An outbound adapter is responsible for bidirectional mapping between Domain Records and JPA Entities.
- **Configuration & Security:** All Spring Boot configuration, exception handling (`GlobalExceptionHandler`), and JWT filters reside in the `shared/infrastructure` module.

## 2. Coding Rules & Constraints

- **No Lombok:** The use of Lombok (`@Data`, `@Getter`, `@Setter`, `@Builder`, etc.) is strictly forbidden. Java Records inherently provide immutability, getters, `equals()`, `hashCode()`, and `toString()`.
- **Constructor Injection:** Dependency injection must be performed via explicit constructors. `@Autowired` on fields is not allowed.
- **Explicit Mapping:** No automatic mappers (like MapStruct). Mappers must be explicit static methods (e.g., `toDomain()`, `toEntity()`) to guarantee complete control over layer boundaries.
- **English Only:** All code artifacts (identifiers, comments, commit messages, documentation) must be written in English. Conversational output (e.g., AI chat) remains in Spanish.

## 3. Testing Strategy

- **Unit Testing:** All Application Services (Use Cases) must be thoroughly unit-tested using Mockito and JUnit 5.
- **Architecture Testing:** `ArchUnit` is implemented (`ArchitectureTest.java`) to automatically verify that:
  - Domain layer does not depend on Application or Infrastructure.
  - Application layer does not depend on Infrastructure.
  - No Spring annotations or JPA annotations leak into Domain or Application.
- **Coverage:** Core business logic must have unit test coverage, ensuring edge cases (like `ResourceNotFoundException`) are handled.

## 4. API Design

- **Admin Endpoints:** Prefixed with `/api/admin/...`. Require valid JWT authentication (Role: `ADMIN`). Use `*Dto` for incoming and outgoing data.
- **Public Endpoints:** Prefixed with `/api/public/...`. Open access for frontend rendering. Usually implemented in separate controllers (e.g., `PublicProjectController`).
- **Standardized Error Handling:** Handled globally by `GlobalExceptionHandler`, returning a consistent JSON structure (`timestamp`, `status`, `error`, `message`, `path`).
