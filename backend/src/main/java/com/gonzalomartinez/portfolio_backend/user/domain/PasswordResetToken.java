package com.gonzalomartinez.portfolio_backend.user.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record PasswordResetToken(
    UUID id,
    String token,
    String username,
    LocalDateTime expiresAt,
    boolean used
) {
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }

    public PasswordResetToken markAsUsed() {
        return new PasswordResetToken(id, token, username, expiresAt, true);
    }
}
