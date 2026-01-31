package com.gonzalomartinez.portfolio_backend.infrastructure.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class InputSanitizer {
    
    private static final Pattern HTML_PATTERN = Pattern.compile("<[^>]*>");
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("<script[^>]*>.*?</script>", Pattern.CASE_INSENSITIVE);
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "('.*(--|;|/\\*|\\*/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union).*')",
            Pattern.CASE_INSENSITIVE
    );
    
    public String sanitize(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }
        
        // Remove script tags
        input = input.replaceAll("(?i)<script[^>]*>.*?</script>", "");
        
        // Remove all HTML tags to prevent XSS
        input = input.replaceAll("<[^>]*>", "");
        
        // Remove non-printable control characters but keep format (newlines, tabs)
        // This maintains strict security against hidden control chars while preserving text structure
        input = input.replaceAll("[\\p{Cntrl}&&[^\\r\\n\\t]]", "");
        
        String sanitized = input.trim();
        
        return sanitized;
    }
    
    public boolean containsSqlInjection(String input) {
        if (input == null) {
            return false;
        }
        return SQL_INJECTION_PATTERN.matcher(input).find();
    }
    
    public String sanitizeUrl(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        
        // Basic URL validation and sanitation
        url = url.trim();
        
        // Remove javascript: and data: URLs
        if (url.toLowerCase().startsWith("javascript:") ||
            url.toLowerCase().startsWith("data:")) {
            return "";
        }
        
        return url;
    }
}
