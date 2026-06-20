package com.gonzalomartinez.portfolio_backend.shared.application;

public interface SanitizerPort {
    String sanitize(String input);
    boolean containsSqlInjection(String input);
    String sanitizeUrl(String input);
}
