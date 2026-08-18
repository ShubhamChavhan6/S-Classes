package com.sclasses.algorithms;

import java.util.*;

/**
 * High-Performance Java Algorithms:
 * 1. QuickSort with Lomuto Partitioning
 * 2. 0/1 Knapsack 2D Dynamic Programming Tabulation
 * 3. Dijkstra's Single-Source Shortest Path using PriorityQueue
 */
public class AlgorithmSuite {

    // 1. QuickSort
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    // 2. 0/1 Knapsack Dynamic Programming
    public static int knapsack(int W, int[] weights, int[] values, int n) {
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                if (i == 0 || w == 0) {
                    dp[i][w] = 0;
                } else if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][W];
    }

    // 3. Dijkstra's Shortest Path
    public static class Edge {
        public int target;
        public int weight;
        public Edge(int target, int weight) { this.target = target; this.weight = weight; }
    }

    public static int[] dijkstra(int V, List<List<Edge>> adj, int source) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{source, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            int d = curr[1];

            if (d > dist[u]) continue;

            for (Edge edge : adj.get(u)) {
                if (dist[u] + edge.weight < dist[edge.target]) {
                    dist[edge.target] = dist[u] + edge.weight;
                    pq.add(new int[]{edge.target, dist[edge.target]});
                }
            }
        }
        return dist;
    }

    public static void runDemo() {
        System.out.println("--- 1. QuickSort Execution ---");
        int[] arr = { 64, 34, 25, 12, 22, 11, 90 };
        System.out.println("  Raw array: " + Arrays.toString(arr));
        quickSort(arr, 0, arr.length - 1);
        System.out.println("  Sorted array: " + Arrays.toString(arr));

        System.out.println("\n--- 2. 0/1 Knapsack Dynamic Programming ---");
        int[] val = { 60, 100, 120 };
        int[] wt = { 10, 20, 30 };
        int capacity = 50;
        int maxProfit = knapsack(capacity, wt, val, val.length);
        System.out.println("  Max Profit for W=" + capacity + ": ₹" + maxProfit);

        System.out.println("\n--- 3. Dijkstra's Algorithm on 5-Node Graph ---");
        int V = 5;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        adj.get(0).add(new Edge(1, 9));
        adj.get(0).add(new Edge(2, 6));
        adj.get(0).add(new Edge(3, 5));
        adj.get(0).add(new Edge(4, 3));
        adj.get(2).add(new Edge(1, 2));
        adj.get(2).add(new Edge(3, 4));

        int[] distances = dijkstra(V, adj, 0);
        for (int i = 0; i < V; i++) {
            System.out.printf("  Shortest Distance from Node 0 to %d: %d%n", i, distances[i]);
        }
    }
}
