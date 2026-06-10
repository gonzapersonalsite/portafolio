package com.gonzalomartinez.portfolio_backend.infrastructure.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class RateLimitProperties {

    @Value("${rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${rate-limit.public.capacity:100}")
    private int publicCapacity;

    @Value("${rate-limit.public.tokens:10}")
    private int publicTokens;

    @Value("${rate-limit.admin.capacity:50}")
    private int adminCapacity;

    @Value("${rate-limit.admin.tokens:5}")
    private int adminTokens;
}
