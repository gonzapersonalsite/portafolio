package com.gonzalomartinez.portfolio_backend.user.application;

public interface TokenGeneratorPort {
    String generateToken(String username);
    String extractUsername(String token);
    Boolean validateToken(String token, String username);
}
