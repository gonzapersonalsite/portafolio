package com.gonzalomartinez.portfolio_backend.user.application;

import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
    @NotBlank(message = "Username is required")
    String username
) {}
