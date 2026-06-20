# SKILL: Spring Hexagonal Maintainer

## Architectural Contract

This skill enforces the architectural rules for the Spring Boot Hexagonal Template. 
Future AIs **are explicitly prohibited** from mutating this architecture or suggesting patterns that violate these rules.

### 1. The Dependency Rule (Clean Architecture)
- **Domain (`domain`)**: The core of the business. It must be 100% pure Java. It has no dependencies on `application`, `infrastructure`, or any framework (e.g., Spring, JPA, Jackson).
- **Application (`application`)**: Orchestrates use cases. It depends ONLY on `domain`. It defines Ports (interfaces) that infrastructure must implement, and Use Cases that infrastructure can invoke.
- **Infrastructure (`infrastructure`)**: The outermost layer. It contains REST Controllers, Spring configurations, JPA Entities, Repositories, and external Adapters. It depends on `application` and `domain`.

### 2. S.O.L.I.D. Principles Enforcement
- **Single Responsibility (SRP)**: Classes and Use Cases must do exactly one thing. Do not create God classes or massive services.
- **Open/Closed (OCP)**: Extend behavior via new implementations of Ports/Interfaces, not by modifying existing domain logic.
- **Liskov Substitution (LSP)**: Infrastructure Adapters must perfectly substitute the Port interfaces without breaking the application logic.
- **Interface Segregation (ISP)**: Keep Ports small and specific. Avoid large, bloated interfaces (e.g., separate `UserReaderPort` and `UserWriterPort` if appropriate, instead of one massive `UserRepositoryPort`).
- **Dependency Inversion (DIP)**: High-level modules (`application`) must not depend on low-level modules (`infrastructure`). Both must depend on abstractions (Ports).

### 3. Java Records & Immutability
- Use **Java Records** for all DTOs (Data Transfer Objects), Value Objects, and domain models where applicable.
- All domain objects should be designed as immutable by default. Mutability is a code smell.

### 4. Zero Lombok Policy
- **Lombok is strictly forbidden.** 
- The domain must remain pure and transparent. 
- Use native Java features (Records) to avoid boilerplate. 
- Constructors must be explicit, especially for Dependency Injection in Spring (constructor injection is mandatory).

### 5. Ports and Adapters Implementation
- **Inbound Ports**: Interfaces in the `application` layer that define Use Cases. Implemented by Application Services. Invoked by `infrastructure` (e.g., REST Controllers).
- **Outbound Ports**: Interfaces in the `domain` or `application` layer (e.g., `UserRepositoryPort`). Implemented by `infrastructure` Adapters (e.g., `InMemoryUserRepositoryAdapter` or `JpaUserRepositoryAdapter`).

### 6. Validation and Linting (ArchUnit)
- The project includes **ArchUnit** tests in `src/test/java/.../architecture`.
- Any code generated MUST pass these architectural tests. Do not attempt to bypass or delete these tests.
- Code style and architecture are enforced via pre-commit hooks (Husky).

---
**Directive to AI:** 
"I acknowledge that S.O.L.I.D. principles and this Hexagonal Architecture contract are absolute. I will not suggest or write code that couples the domain to the framework, nor will I use Lombok."
