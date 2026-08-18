package com.sclasses.backend;

import com.sclasses.backend.service.VirtualThreadTaskExecutorService;
import com.sclasses.backend.service.TokenBucketRateLimiter;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Virtual Threads & Concurrency Tests (Java 21 Loom & CAS)")
class VirtualThreadsConcurrencyTest {

    @Test
    @DisplayName("Should execute 1,000 concurrent tasks on Virtual Threads seamlessly")
    void testVirtualThreadThroughput() throws Exception {
        int tasks = 1_000;
        CountDownLatch latch = new CountDownLatch(tasks);
        AtomicInteger counter = new AtomicInteger(0);

        try (var executorService = new VirtualThreadTaskExecutorService()) {
            for (int i = 0; i < tasks; i++) {
                executorService.executeAsync(() -> {
                    counter.incrementAndGet();
                    latch.countDown();
                });
            }

            boolean completedInTime = latch.await(5, TimeUnit.SECONDS);
            assertTrue(completedInTime, "All virtual thread tasks should complete within timeout");
            assertEquals(tasks, counter.get());
        }
    }

    @Test
    @DisplayName("Should enforce token bucket rate limiting atomically")
    void testTokenBucketRateLimiter() {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(5, 1);
        
        // Should allow consuming up to 5 tokens
        for (int i = 0; i < 5; i++) {
            assertTrue(limiter.tryAcquire(), "Token " + (i + 1) + " should be acquired successfully");
        }

        // 6th immediate token should be rejected (exhausted bucket)
        assertFalse(limiter.tryAcquire(), "Exhausted token bucket should reject immediate request");
    }
}
