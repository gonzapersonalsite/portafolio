package com.gonzalomartinez.portfolio_backend.infrastructure.email;

import com.gonzalomartinez.portfolio_backend.application.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
@Slf4j
public class ResendEmailService implements EmailService {

    private final RestClient restClient;
    private final String fromEmail;

    public ResendEmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from-email}") String fromEmail) {
        this.fromEmail = fromEmail;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", to,
                "subject", "Password Reset - Portfolio",
                "html", buildEmailHtml(resetLink)
        );

        try {
            String response = restClient.post()
                    .uri("/emails")
                    .body(body)
                    .retrieve()
                    .body(String.class);
            log.info("Password reset email sent to: {}", to);
            log.debug("Resend response: {}", response);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    private String buildEmailHtml(String resetLink) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You have requested to reset your portfolio admin password.</p>
                    <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
                    <a href="%s"
                       style="display: inline-block; padding: 12px 24px; background-color: #1976d2;
                              color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Reset Password
                    </a>
                    <p style="margin-top: 24px; color: #666; font-size: 0.85em;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
                """.formatted(resetLink);
    }
}
