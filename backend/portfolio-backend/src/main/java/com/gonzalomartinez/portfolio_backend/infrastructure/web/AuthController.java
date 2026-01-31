package com.gonzalomartinez.portfolio_backend.infrastructure.web;

import com.gonzalomartinez.portfolio_backend.application.dto.AuthResponse;
import com.gonzalomartinez.portfolio_backend.application.dto.LoginRequest;
import com.gonzalomartinez.portfolio_backend.application.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationService authenticationService;
    
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
}
