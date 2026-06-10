package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.AuthResponse;
import com.gonzalomartinez.portfolio_backend.application.dto.LoginRequest;
import com.gonzalomartinez.portfolio_backend.application.dto.ResetPasswordRequest;
import com.gonzalomartinez.portfolio_backend.domain.exception.InvalidCredentialsException;
import com.gonzalomartinez.portfolio_backend.domain.model.PasswordResetToken;
import com.gonzalomartinez.portfolio_backend.domain.model.User;
import com.gonzalomartinez.portfolio_backend.domain.repository.PasswordResetTokenRepository;
import com.gonzalomartinez.portfolio_backend.domain.repository.UserRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.password-reset.frontend-url}")
    private String frontendUrl;

    @Value("${app.password-reset.token-expiration-minutes}")
    private int tokenExpirationMinutes;

    public AuthResponse login(LoginRequest loginRequest) {
        log.debug("Attempting login for user: {}", loginRequest.getUsername());

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            log.warn("Invalid password attempt for user: {}", loginRequest.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(86400); // 24 hours

        log.info("User {} logged in successfully", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .expiresAt(expiresAt)
                .build();
    }

    public boolean validateToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            return jwtService.validateToken(token, username);
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }

    public void forgotPassword(String username) {
        userRepository.findByUsername(username).ifPresentOrElse(
                user -> {
                    String token = UUID.randomUUID().toString();
                    PasswordResetToken resetToken = PasswordResetToken.builder()
                            .token(token)
                            .username(username)
                            .expiresAt(LocalDateTime.now().plusMinutes(tokenExpirationMinutes))
                            .used(false)
                            .build();
                    resetTokenRepository.save(resetToken);

                    String resetLink = frontendUrl + "/admin/reset-password?token=" + token;
                    emailService.sendPasswordResetEmail(adminEmail, resetLink);

                    log.info("Password reset email sent for user: {}", username);
                },
                () -> log.info("Password reset requested for non-existent user: {}", username)
        );
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid or expired reset token"));

        if (resetToken.isUsed()) {
            throw new InvalidCredentialsException("This reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidCredentialsException("This reset token has expired");
        }

        User user = userRepository.findByUsername(resetToken.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", resetToken.getUsername());
    }
}
