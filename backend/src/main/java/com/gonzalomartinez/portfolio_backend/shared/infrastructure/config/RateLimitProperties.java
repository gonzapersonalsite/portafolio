package com.gonzalomartinez.portfolio_backend.shared.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {
    private boolean enabled = true;
    private int adminCapacity = 100;
    private int adminTokens = 10;
    private int publicCapacity = 50;
    private int publicTokens = 5;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getAdminCapacity() {
        return adminCapacity;
    }

    public void setAdminCapacity(int adminCapacity) {
        this.adminCapacity = adminCapacity;
    }

    public int getAdminTokens() {
        return adminTokens;
    }

    public void setAdminTokens(int adminTokens) {
        this.adminTokens = adminTokens;
    }

    public int getPublicCapacity() {
        return publicCapacity;
    }

    public void setPublicCapacity(int publicCapacity) {
        this.publicCapacity = publicCapacity;
    }

    public int getPublicTokens() {
        return publicTokens;
    }

    public void setPublicTokens(int publicTokens) {
        this.publicTokens = publicTokens;
    }
}
