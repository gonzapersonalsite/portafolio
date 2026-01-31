package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.AuthResponse;
import com.gonzalomartinez.portfolio_backend.application.dto.LoginRequest;
import com.gonzalomartinez.portfolio_backend.domain.exception.InvalidCredentialsException;
import com.gonzalomartinez.portfolio_backend.domain.model.User;
import com.gonzalomartinez.portfolio_backend.domain.repository.UserRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
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
}
