package com.gonzalomartinez.portfolio_backend.infrastructure.security;

import com.gonzalomartinez.portfolio_backend.infrastructure.config.RateLimitProperties;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitProperties properties;
    private final TokenBucketRateLimiter rateLimiter;

    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {

        if (!properties.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        boolean isAdminPath = path.startsWith("/api/admin/");
        boolean isPublicPath = path.startsWith("/api/public/");
        boolean isAuthPath = path.startsWith("/api/auth/");

        if (!isAdminPath && !isPublicPath && !isAuthPath) {
            filterChain.doFilter(request, response);
            return;
        }

        int capacity;
        int refillRate;

        if (isAdminPath) {
            capacity = properties.getAdminCapacity();
            refillRate = properties.getAdminTokens();
        } else {
            capacity = properties.getPublicCapacity();
            refillRate = properties.getPublicTokens();
        }

        String clientIp = getClientIp(request);
        String bucketKey = isAdminPath ? "admin:" + clientIp : "public:" + clientIp;

        if (!rateLimiter.tryConsume(bucketKey, capacity, refillRate)) {
            log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please try again later.\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String remoteAddr = request.getRemoteAddr();
        return remoteAddr != null ? remoteAddr : "unknown";
    }
}
