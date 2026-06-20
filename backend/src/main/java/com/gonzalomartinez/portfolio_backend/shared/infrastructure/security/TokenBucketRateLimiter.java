package com.gonzalomartinez.portfolio_backend.shared.infrastructure.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBucketRateLimiter {

    private static final Logger log = LoggerFactory.getLogger(TokenBucketRateLimiter.class);

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String key, int capacity, int refillRate) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket(capacity, refillRate));
        return bucket.tryConsume();
    }

    public void evictStaleEntries(long maxAgeSeconds) {
        Instant cutoff = Instant.now().minusSeconds(maxAgeSeconds);
        buckets.entrySet().removeIf(entry -> entry.getValue().lastAccess.isBefore(cutoff));
    }

    private static class Bucket {
        private final int capacity;
        private final int refillRate;
        private double tokens;
        private Instant lastRefill;
        private Instant lastAccess;

        Bucket(int capacity, int refillRate) {
            this.capacity = capacity;
            this.refillRate = refillRate;
            this.tokens = capacity;
            this.lastRefill = Instant.now();
            this.lastAccess = Instant.now();
        }

        synchronized boolean tryConsume() {
            refill();
            lastAccess = Instant.now();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            Instant now = Instant.now();
            long secondsElapsed = now.getEpochSecond() - lastRefill.getEpochSecond();
            if (secondsElapsed > 0) {
                double newTokens = tokens + (secondsElapsed * refillRate);
                tokens = Math.min(newTokens, capacity);
                lastRefill = now;
            }
        }
    }
}
