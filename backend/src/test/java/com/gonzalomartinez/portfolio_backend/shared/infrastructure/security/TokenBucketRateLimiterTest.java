package com.gonzalomartinez.portfolio_backend.shared.infrastructure.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenBucketRateLimiterTest {

    private final TokenBucketRateLimiter limiter = new TokenBucketRateLimiter();

    @Test
    void tryConsume_AllowsRequestsWithinCapacity() {
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryConsume("test-key", 5, 1));
        }
    }

    @Test
    void tryConsume_BlocksWhenExhausted() {
        for (int i = 0; i < 3; i++) {
            limiter.tryConsume("exhaust-key", 3, 0);
        }
        assertFalse(limiter.tryConsume("exhaust-key", 3, 0));
    }

    @Test
    void tryConsume_IsolatedByKey() {
        limiter.tryConsume("key-a", 1, 0);
        assertFalse(limiter.tryConsume("key-a", 1, 0));
        assertTrue(limiter.tryConsume("key-b", 1, 0));
    }

    @Test
    void tryConsume_InitiallyFullCapacity() {
        for (int i = 0; i < 10; i++) {
            assertTrue(limiter.tryConsume("full-key", 10, 0));
        }
        assertFalse(limiter.tryConsume("full-key", 10, 0));
    }
}
