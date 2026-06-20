package com.gonzalomartinez.portfolio_backend.user.application;

public interface EmailSenderPort {
    void sendPasswordResetEmail(String to, String resetLink);
}
