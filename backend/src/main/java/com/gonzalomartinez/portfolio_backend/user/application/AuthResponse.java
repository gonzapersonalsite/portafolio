package com.gonzalomartinez.portfolio_backend.user.application;

import java.time.LocalDateTime;

public record AuthResponse(
    String token,
    String username,
    LocalDateTime expiresAt
) {}
