package com.gonzalomartinez.portfolio_backend.user.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.InvalidCredentialsException;
import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetToken;
import com.gonzalomartinez.portfolio_backend.user.domain.PasswordResetTokenRepositoryPort;
import com.gonzalomartinez.portfolio_backend.user.domain.User;
import com.gonzalomartinez.portfolio_backend.user.domain.UserRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.infrastructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepositoryPort userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenGeneratorPort jwtService;

    @Mock
    private PasswordResetTokenRepositoryPort resetTokenRepository;

    @Mock
    private EmailSenderPort emailService;

    @InjectMocks
    private AuthService authService;

    private static final String ADMIN_EMAIL = "admin@test.com";
    private static final String FRONTEND_URL = "http://localhost:5173";
    private static final int TOKEN_EXPIRATION_MINUTES = 15;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "adminEmail", ADMIN_EMAIL);
        ReflectionTestUtils.setField(authService, "frontendUrl", FRONTEND_URL);
        ReflectionTestUtils.setField(authService, "tokenExpirationMinutes", TOKEN_EXPIRATION_MINUTES);
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        LoginRequest request = new LoginRequest("admin", "password");
        User user = new User(UUID.randomUUID(), "admin", "hashed", "ADMIN", LocalDateTime.now(), LocalDateTime.now());
        
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed")).thenReturn(true);
        when(jwtService.generateToken("admin")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        assertEquals("admin", response.username());
        assertNotNull(response.expiresAt());
    }

    @Test
    void login_UserNotFound_ThrowsInvalidCredentials() {
        LoginRequest request = new LoginRequest("unknown", "password");
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void login_WrongPassword_ThrowsInvalidCredentials() {
        LoginRequest request = new LoginRequest("admin", "wrong");
        User user = new User(UUID.randomUUID(), "admin", "hashed", "ADMIN", LocalDateTime.now(), LocalDateTime.now());
        
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        when(jwtService.extractUsername("valid-token")).thenReturn("admin");
        when(jwtService.validateToken("valid-token", "admin")).thenReturn(true);

        boolean result = authService.validateToken("valid-token");

        assertTrue(result);
    }

    @Test
    void validateToken_InvalidSignature_ReturnsFalse() {
        when(jwtService.extractUsername("invalid-token")).thenThrow(new RuntimeException("bad signature"));

        boolean result = authService.validateToken("invalid-token");

        assertFalse(result);
    }

    @Test
    void forgotPassword_UserExists_CreatesTokenAndSendsEmail() {
        User user = new User(UUID.randomUUID(), "admin", "hashed", "ADMIN", LocalDateTime.now(), LocalDateTime.now());
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        authService.forgotPassword("admin");

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(resetTokenRepository).save(tokenCaptor.capture());
        PasswordResetToken savedToken = tokenCaptor.getValue();
        assertEquals("admin", savedToken.username());
        assertFalse(savedToken.used());
        assertNotNull(savedToken.token());
        assertTrue(savedToken.expiresAt().isAfter(LocalDateTime.now()));

        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetEmail(eq(ADMIN_EMAIL), linkCaptor.capture());
        assertTrue(linkCaptor.getValue().contains("/admin/reset-password?token="));
        assertTrue(linkCaptor.getValue().contains(savedToken.token()));
    }

    @Test
    void resetPassword_ValidToken_ResetsPassword() {
        PasswordResetToken resetToken = new PasswordResetToken(
                UUID.randomUUID(), "valid-reset-token", "admin", LocalDateTime.now().plusMinutes(30), false
        );
        User user = new User(UUID.randomUUID(), "admin", "old-hash", "ADMIN", LocalDateTime.now(), LocalDateTime.now());

        when(resetTokenRepository.findByToken("valid-reset-token")).thenReturn(Optional.of(resetToken));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");

        ResetPasswordRequest request = new ResetPasswordRequest("valid-reset-token", "new-password");

        authService.resetPassword(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("new-hash", userCaptor.getValue().passwordHash());

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(resetTokenRepository).save(tokenCaptor.capture());
        assertTrue(tokenCaptor.getValue().used());
    }

    @Test
    void resetPassword_InvalidToken_ThrowsException() {
        when(resetTokenRepository.findByToken("bad-token")).thenReturn(Optional.empty());

        ResetPasswordRequest request = new ResetPasswordRequest("bad-token", "new-password");

        assertThrows(InvalidCredentialsException.class, () -> authService.resetPassword(request));
    }
}
