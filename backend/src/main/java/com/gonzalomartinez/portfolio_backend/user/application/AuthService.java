package com.gonzalomartinez.portfolio_backend.user.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.InvalidCredentialsException;
import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetToken;
import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetTokenRepositoryPort;
import com.gonzalomartinez.portfolio_backend.user.domain.User;
import com.gonzalomartinez.portfolio_backend.user.domain.UserRepositoryPort;

import com.gonzalomartinez.portfolio_backend.user.application.EmailSenderPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService implements AuthUseCase {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenGeneratorPort jwtService;
    private final PasswordResetTokenRepositoryPort resetTokenRepository;
    private final EmailSenderPort emailService; 

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.password-reset.frontend-url}")
    private String frontendUrl;

    @Value("${app.password-reset.token-expiration-minutes}")
    private int tokenExpirationMinutes;

    public AuthService(
            UserRepositoryPort userRepository,
            PasswordEncoder passwordEncoder,
            TokenGeneratorPort jwtService,
            PasswordResetTokenRepositoryPort resetTokenRepository,
            EmailSenderPort emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.resetTokenRepository = resetTokenRepository;
        this.emailService = emailService;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.debug("Attempting login for user: {}", loginRequest.username());

        User user = userRepository.findByUsername(loginRequest.username())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequest.password(), user.passwordHash())) {
            log.warn("Invalid password attempt for user: {}", loginRequest.username());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.username());
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400); // 24 hours

        log.info("User {} logged in successfully", user.username());

        return new AuthResponse(token, user.username(), expiresAt);
    }

    @Override
    public boolean validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            return jwtService.validateToken(token, username);
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public void forgotPassword(String username) {
        userRepository.findByUsername(username).ifPresentOrElse(
                user -> {
                    String tokenStr = UUID.randomUUID().toString();
                    PasswordResetToken resetToken = new PasswordResetToken(
                            null,
                            tokenStr,
                            username,
                            LocalDateTime.now().plusMinutes(tokenExpirationMinutes),
                            false
                    );
                    resetTokenRepository.save(resetToken);

                    String resetLink = frontendUrl + "/admin/reset-password?token=" + tokenStr;
                    emailService.sendPasswordResetEmail(adminEmail, resetLink);

                    log.info("Password reset email sent for user: {}", username);
                },
                () -> log.info("Password reset requested for non-existent user: {}", username)
        );
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired reset token"));

        if (resetToken.used()) {
            throw new InvalidCredentialsException("This reset token has already been used");
        }

        if (resetToken.isExpired()) {
            throw new InvalidCredentialsException("This reset token has expired");
        }

        User user = userRepository.findByUsername(resetToken.username())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        User updatedUser = user.withPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(updatedUser);

        resetTokenRepository.save(resetToken.markAsUsed());

        log.info("Password reset successful for user: {}", resetToken.username());
    }
}
