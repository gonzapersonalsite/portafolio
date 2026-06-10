package com.gonzalomartinez.portfolio_backend.application.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String resetLink);
}
