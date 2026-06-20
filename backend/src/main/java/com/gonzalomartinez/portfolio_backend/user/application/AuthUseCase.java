package com.gonzalomartinez.portfolio_backend.user.application;

public interface AuthUseCase {
    AuthResponse login(LoginRequest loginRequest);
    boolean validateToken(String token);
    void forgotPassword(String username);
    void resetPassword(ResetPasswordRequest request);
}
