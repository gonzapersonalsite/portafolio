package com.gonzalomartinez.portfolio_backend.user.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetToken;
import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetTokenRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PasswordResetTokenRepositoryAdapter implements PasswordResetTokenRepositoryPort {

    private final JpaPasswordResetTokenRepository jpaRepository;

    public PasswordResetTokenRepositoryAdapter(JpaPasswordResetTokenRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return jpaRepository.findByToken(token)
                .map(this::toDomain);
    }

    @Override
    public PasswordResetToken save(PasswordResetToken token) {
        PasswordResetTokenEntity entity = toEntity(token);
        PasswordResetTokenEntity savedEntity = jpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    private PasswordResetToken toDomain(PasswordResetTokenEntity entity) {
        return new PasswordResetToken(
                entity.getId(),
                entity.getToken(),
                entity.getUsername(),
                entity.getExpiresAt(),
                entity.isUsed()
        );
    }

    private PasswordResetTokenEntity toEntity(PasswordResetToken domain) {
        return new PasswordResetTokenEntity(
                domain.id(),
                domain.token(),
                domain.username(),
                domain.expiresAt(),
                domain.used()
        );
    }
}
