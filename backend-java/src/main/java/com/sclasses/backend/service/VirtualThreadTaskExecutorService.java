package com.sclasses.backend.service;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.springframework.stereotype.Service;

/**
 * High-Throughput Java 21 Loom Virtual Thread Task Executor Service.
 * Leverages Project Loom virtual threads to scale concurrent student sessions with minimal memory overhead.
 */
@Service
public class VirtualThreadTaskExecutorService implements AutoCloseable {

    private final ExecutorService virtualExecutor;

    public VirtualThreadTaskExecutorService() {
        this.virtualExecutor = Executors.newVirtualThreadPerTaskExecutor();
    }

    public <T> Future<T> submitTask(Callable<T> task) {
        return virtualExecutor.submit(task);
    }

    public void executeAsync(Runnable command) {
        virtualExecutor.execute(command);
    }

    public <T> CompletableFuture<T> supplyAsync(Callable<T> task) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, virtualExecutor);
    }

    @Override
    public void close() {
        if (!virtualExecutor.isShutdown()) {
            virtualExecutor.shutdown();
        }
    }
}
