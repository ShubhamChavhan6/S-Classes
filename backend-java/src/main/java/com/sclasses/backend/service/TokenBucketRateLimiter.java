package com.sclasses.backend.service;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

/**
 * 100% Pure Java Lock-Free Token Bucket Rate Limiter.
 * Protects AI and compilation endpoints against burst traffic using CAS atomic operations.
 */
@Service
public class TokenBucketRateLimiter {

    private final long maxCapacity;
    private final long refillRatePerSecond;
    private final AtomicLong availableTokens;
    private final AtomicLong lastRefillTimestamp;

    public TokenBucketRateLimiter() {
        this(60, 10); // 60 burst capacity, 10 tokens/second refill
    }

    public TokenBucketRateLimiter(long maxCapacity, long refillRatePerSecond) {
        this.maxCapacity = maxCapacity;
        this.refillRatePerSecond = refillRatePerSecond;
        this.availableTokens = new AtomicLong(maxCapacity);
        this.lastRefillTimestamp = new AtomicLong(System.currentTimeMillis());
    }

    public boolean tryAcquire() {
        return tryAcquire(1);
    }

    public boolean tryAcquire(long tokensToConsume) {
        refillTokens();
        while (true) {
            long currentTokens = availableTokens.get();
            if (currentTokens < tokensToConsume) {
                return false;
            }
            if (availableTokens.compareAndSet(currentTokens, currentTokens - tokensToConsume)) {
                return true;
            }
        }
    }

    private void refillTokens() {
        long now = System.currentTimeMillis();
        long lastRefill = lastRefillTimestamp.get();
        long elapsedSeconds = (now - lastRefill) / 1000;

        if (elapsedSeconds > 0) {
            if (lastRefillTimestamp.compareAndSet(lastRefill, now)) {
                long tokensToAdd = elapsedSeconds * refillRatePerSecond;
                availableTokens.updateAndGet(curr -> Math.min(maxCapacity, curr + tokensToAdd));
            }
        }
    }

    public long getAvailableTokens() {
        refillTokens();
        return availableTokens.get();
    }
}
