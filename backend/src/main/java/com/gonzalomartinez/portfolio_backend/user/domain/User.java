package com.gonzalomartinez.portfolio_backend.user.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record User(
    UUID id,
    String username,
    String passwordHash,
    String role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public User withPasswordHash(String newPasswordHash) {
        return new User(id, username, newPasswordHash, role, createdAt, LocalDateTime.now());
    }
}
