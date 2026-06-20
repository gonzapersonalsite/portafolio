package com.gonzalomartinez.portfolio_backend.user.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.user.application.AuthResponse;
import com.gonzalomartinez.portfolio_backend.user.application.ForgotPasswordRequest;
import com.gonzalomartinez.portfolio_backend.user.application.LoginRequest;
import com.gonzalomartinez.portfolio_backend.user.application.ResetPasswordRequest;
import com.gonzalomartinez.portfolio_backend.user.application.AuthUseCase;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authenticationService;

    public AuthController(AuthUseCase authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authenticationService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false);
        }

        String token = authHeader.substring(7);
        boolean isValid = authenticationService.validateToken(token);

        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.username());
        return ResponseEntity.ok(Map.of("message", "If the username exists, a password reset email has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}
