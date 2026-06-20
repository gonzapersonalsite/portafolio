package com.gonzalomartinez.portfolio_backend.user.domain;

import java.util.Optional;

public interface PasswordResetTokenRepositoryPort {
    Optional<PasswordResetToken> findByToken(String token);
    PasswordResetToken save(PasswordResetToken token);
}
