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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordResetTokenRepository resetTokenRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private static final String ADMIN_EMAIL = "admin@test.com";
    private static final String FRONTEND_URL = "http://localhost:5173";
    private static final int TOKEN_EXPIRATION_MINUTES = 15;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authenticationService, "adminEmail", ADMIN_EMAIL);
        ReflectionTestUtils.setField(authenticationService, "frontendUrl", FRONTEND_URL);
        ReflectionTestUtils.setField(authenticationService, "tokenExpirationMinutes", TOKEN_EXPIRATION_MINUTES);
    }

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        LoginRequest request = new LoginRequest("admin", "password");
        User user = User.builder()
                .username("admin")
                .passwordHash("hashed")
                .role("ADMIN")
                .build();
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed")).thenReturn(true);
        when(jwtService.generateToken("admin")).thenReturn("jwt-token");

        AuthResponse response = authenticationService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("admin", response.getUsername());
        assertNotNull(response.getExpiresAt());
    }

    @Test
    void login_UserNotFound_ThrowsInvalidCredentials() {
        LoginRequest request = new LoginRequest("unknown", "password");
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.login(request));
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void login_WrongPassword_ThrowsInvalidCredentials() {
        LoginRequest request = new LoginRequest("admin", "wrong");
        User user = User.builder()
                .username("admin")
                .passwordHash("hashed")
                .role("ADMIN")
                .build();
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.login(request));
        verify(jwtService, never()).generateToken(anyString());
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        when(jwtService.extractUsername("valid-token")).thenReturn("admin");
        when(jwtService.validateToken("valid-token", "admin")).thenReturn(true);

        boolean result = authenticationService.validateToken("valid-token");

        assertTrue(result);
    }

    @Test
    void validateToken_InvalidSignature_ReturnsFalse() {
        when(jwtService.extractUsername("invalid-token")).thenThrow(new RuntimeException("bad signature"));

        boolean result = authenticationService.validateToken("invalid-token");

        assertFalse(result);
    }

    @Test
    void forgotPassword_UserExists_CreatesTokenAndSendsEmail() {
        User user = User.builder()
                .username("admin")
                .passwordHash("hashed")
                .role("ADMIN")
                .build();
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));

        authenticationService.forgotPassword("admin");

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(resetTokenRepository).save(tokenCaptor.capture());
        PasswordResetToken savedToken = tokenCaptor.getValue();
        assertEquals("admin", savedToken.getUsername());
        assertFalse(savedToken.isUsed());
        assertNotNull(savedToken.getToken());
        assertTrue(savedToken.getExpiresAt().isAfter(LocalDateTime.now()));

        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetEmail(eq(ADMIN_EMAIL), linkCaptor.capture());
        assertTrue(linkCaptor.getValue().contains("/admin/reset-password?token="));
        assertTrue(linkCaptor.getValue().contains(savedToken.getToken()));
    }

    @Test
    void forgotPassword_UserNotFound_DoesNothing() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        authenticationService.forgotPassword("nonexistent");

        verify(resetTokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString());
    }

    @Test
    void resetPassword_ValidToken_ResetsPassword() {
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("valid-reset-token")
                .username("admin")
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();
        User user = User.builder()
                .username("admin")
                .passwordHash("old-hash")
                .role("ADMIN")
                .build();

        when(resetTokenRepository.findByToken("valid-reset-token")).thenReturn(Optional.of(resetToken));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-reset-token");
        request.setNewPassword("new-password");

        authenticationService.resetPassword(request);

        assertEquals("new-hash", user.getPasswordHash());
        assertTrue(resetToken.isUsed());
        verify(userRepository).save(user);
        verify(resetTokenRepository).save(resetToken);
    }

    @Test
    void resetPassword_InvalidToken_ThrowsException() {
        when(resetTokenRepository.findByToken("bad-token")).thenReturn(Optional.empty());

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("bad-token");
        request.setNewPassword("new-password");

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.resetPassword(request));
    }

    @Test
    void resetPassword_TokenAlreadyUsed_ThrowsException() {
        PasswordResetToken usedToken = PasswordResetToken.builder()
                .token("used-token")
                .username("admin")
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .used(true)
                .build();
        when(resetTokenRepository.findByToken("used-token")).thenReturn(Optional.of(usedToken));

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("used-token");
        request.setNewPassword("new-password");

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.resetPassword(request));
    }

    @Test
    void resetPassword_TokenExpired_ThrowsException() {
        PasswordResetToken expiredToken = PasswordResetToken.builder()
                .token("expired-token")
                .username("admin")
                .expiresAt(LocalDateTime.now().minusMinutes(10))
                .used(false)
                .build();
        when(resetTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(expiredToken));

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("expired-token");
        request.setNewPassword("new-password");

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.resetPassword(request));
    }

    @Test
    void resetPassword_UserNotFound_ThrowsException() {
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("valid-token")
                .username("deleted-user")
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .used(false)
                .build();
        when(resetTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(resetToken));
        when(userRepository.findByUsername("deleted-user")).thenReturn(Optional.empty());

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("valid-token");
        request.setNewPassword("new-password");

        assertThrows(InvalidCredentialsException.class,
                () -> authenticationService.resetPassword(request));
        verify(userRepository, never()).save(any());
    }
}
