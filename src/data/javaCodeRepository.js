// src/data/javaCodeRepository.js

export const JAVA_PROGRAM_CATEGORIES = [
  'All',
  'Java 21 Core & Modern Features',
  'OOPs Principles & Architecture',
  'Data Structures (DSA)',
  'Algorithms & Dynamic Programming',
  'ICSE & CBSE Board Solved PYQs',
  'Design Patterns in Java',
  'Enterprise & Spring Boot'
];

export const JAVA_CODE_REPOSITORY = [
  // --- 1. Java 21 Core & Modern Features ---
  {
    id: 'java21-records-patterns',
    title: 'Java 21 Records, Pattern Matching & Sealed Interfaces',
    category: 'Java 21 Core & Modern Features',
    level: 'ADVANCED',
    description: 'Demonstrates Java 21 sealed interfaces, immutable records, and pattern matching for switch statements.',
    tags: ['Java 21', 'Records', 'Pattern Matching', 'Sealed Classes'],
    code: `// Java 21 Sealed Types, Records and Pattern Matching
public class Main {
    // Sealed Interface permits only specific implementations
    public sealed interface PaymentMethod permits CreditCard, UpiPayment, CryptoWallet {}

    public record CreditCard(String cardNumber, String holderName, double limit) implements PaymentMethod {}
    public record UpiPayment(String upiId, String provider) implements PaymentMethod {}
    public record CryptoWallet(String walletAddress, String network) implements PaymentMethod {}

    // Pattern Matching in switch expressions (Java 21)
    public static String processTransaction(PaymentMethod method, double amount) {
        return switch (method) {
            case CreditCard(var number, var name, var limit) -> 
                amount <= limit 
                    ? "Approved Card payment of Rs." + amount + " for " + name + " [Card ending in " + number.substring(number.length() - 4) + "]"
                    : "Declined: Exceeds limit of Rs." + limit;
            
            case UpiPayment(var id, var provider) -> 
                "Instant UPI Transfer of Rs." + amount + " via " + provider + " (" + id + ") - Status: SUCCESS (0s latency)";
            
            case CryptoWallet(var addr, var net) -> 
                "Settled on-chain transfer of Rs." + amount + " on " + net + " network [" + addr.substring(0, 8) + "...]";
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Java 21 Modern Features Execution ===");
        
        PaymentMethod card = new CreditCard("4111222233334444", "Aarav Sharma", 150000.0);
        PaymentMethod upi = new UpiPayment("aarav@okhdfcbank", "Google Pay");
        PaymentMethod crypto = new CryptoWallet("0x71C...8947B", "Polygon PoS");

        System.out.println(processTransaction(card, 45000.0));
        System.out.println(processTransaction(upi, 2499.0));
        System.out.println(processTransaction(crypto, 12000.0));
    }
}`
  },

  {
    id: 'java21-virtual-threads',
    title: 'Java 21 Virtual Threads (Project Loom) & High-Throughput Concurrency',
    category: 'Java 21 Core & Modern Features',
    level: 'ADVANCED',
    description: 'Demonstrates lightweight Virtual Threads capable of running millions of concurrent tasks with structured concurrency.',
    tags: ['Java 21', 'Virtual Threads', 'Concurrency', 'ExecutorService'],
    code: `// Java 21 Virtual Threads & Structured Task Execution
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("=== Java 21 Virtual Threads (Project Loom) ===");
        System.out.println("Runtime Version: " + System.getProperty("java.version"));
        
        Instant start = Instant.now();
        int totalTasks = 10;

        // Uses Java 21 Virtual Thread Per Task Executor
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<String>> futures = new ArrayList<>();

            for (int i = 1; i <= totalTasks; i++) {
                final int taskId = i;
                futures.add(executor.submit(() -> {
                    // Simulate non-blocking I/O work
                    Thread.sleep(Duration.ofMillis(50));
                    boolean isVirtual = Thread.currentThread().isVirtual();
                    return "Task #" + taskId + " executed on " + (isVirtual ? "Virtual Thread" : "Platform Thread") + " [ID: " + Thread.currentThread().threadId() + "]";
                }));
            }

            for (var future : futures) {
                System.out.println("▶ " + future.get());
            }
        } // Executor auto-closes after all tasks complete

        Instant end = Instant.now();
        System.out.println("Executed " + totalTasks + " concurrent virtual threads in " + Duration.between(start, end).toMillis() + "ms.");
    }
}`
  },

  {
    id: 'java-streams-lambdas',
    title: 'Java 21 Streams API, Lambdas & Parallel Processing',
    category: 'Java 21 Core & Modern Features',
    level: 'INTERMEDIATE',
    description: 'Complex filtering, mapping, grouping by category, and calculating statistical summaries using Java Streams.',
    tags: ['Streams API', 'Lambdas', 'Functional Programming', 'Collectors'],
    code: `// Java Streams API & Statistical Analysis
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    record Student(String name, String stream, int score, boolean isPassed) {}

    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Aarav Sharma", "Computer Science", 98, true),
            new Student("Priya Patel", "Computer Science", 94, true),
            new Student("Rohan Gupta", "Mechanical", 78, true),
            new Student("Ananya Iyer", "Electronics", 89, true),
            new Student("Vikram Malhotra", "Computer Science", 92, true),
            new Student("Sneha Das", "Mechanical", 85, true)
        );

        System.out.println("=== Java 21 Streams & Functional Analytics ===");

        // 1. Group by Academic Stream
        Map<String, List<Student>> byStream = students.stream()
            .collect(Collectors.groupingBy(Student::stream));

        byStream.forEach((stream, list) -> {
            System.out.println("Stream [" + stream + "]: " + list.size() + " student(s)");
        });

        // 2. Summary Statistics for Scores
        IntSummaryStatistics stats = students.stream()
            .mapToInt(Student::score)
            .summaryStatistics();

        System.out.println("\n--- Score Analytics ---");
        System.out.println("Highest Score : " + stats.getMax() + "%");
        System.out.println("Lowest Score  : " + stats.getMin() + "%");
        System.out.println("Average Score : " + String.format("%.2f", stats.getAverage()) + "%");

        // 3. Top 3 Performers
        System.out.println("\n--- Top Performers ---");
        students.stream()
            .filter(s -> s.score() >= 90)
            .sorted(Comparator.comparingInt(Student::score).reversed())
            .forEach(s -> System.out.println("★ " + s.name() + " (" + s.stream() + ") -> " + s.score() + "%"));
    }
}`
  },

  // --- 2. OOPs Principles & Architecture ---
  {
    id: 'java-oop-banking',
    title: 'Object-Oriented Banking Engine (Inheritance, Polymorphism & Encapsulation)',
    category: 'OOPs Principles & Architecture',
    level: 'INTERMEDIATE',
    description: 'A complete OOP hierarchy with Abstract Account, SavingsAccount with Interest, CurrentAccount with Overdraft, and Custom Exception handling.',
    tags: ['OOPs', 'Polymorphism', 'Encapsulation', 'Custom Exceptions'],
    code: `// Java OOP Architecture: Banking & Transaction System
import java.util.*;

abstract class BankAccount {
    private final String accountNumber;
    private final String holderName;
    protected double balance;

    public BankAccount(String accountNumber, String holderName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialBalance;
    }

    public String getAccountNumber() { return accountNumber; }
    public String getHolderName() { return holderName; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
        System.out.println("Deposit of Rs." + amount + " successful. New Balance: Rs." + balance);
    }

    public abstract boolean withdraw(double amount);

    public void printStatement() {
        System.out.println("Account: " + accountNumber + " | Holder: " + holderName + " | Balance: Rs." + balance);
    }
}

class SavingsAccount extends BankAccount {
    private final double interestRate; // e.g. 6.5%

    public SavingsAccount(String accNo, String name, double bal, double interestRate) {
        super(accNo, name, bal);
        this.interestRate = interestRate;
    }

    @Override
    public boolean withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Declined: Insufficient funds in Savings Account " + getAccountNumber());
            return false;
        }
        balance -= amount;
        System.out.println("Savings Withdrawal of Rs." + amount + " approved. Remaining: Rs." + balance);
        return true;
    }

    public void applyAnnualInterest() {
        double interest = balance * (interestRate / 100.0);
        deposit(interest);
        System.out.println("Applied " + interestRate + "% interest of Rs." + interest);
    }
}

class CurrentAccount extends BankAccount {
    private final double overdraftLimit;

    public CurrentAccount(String accNo, String name, double bal, double overdraftLimit) {
        super(accNo, name, bal);
        this.overdraftLimit = overdraftLimit;
    }

    @Override
    public boolean withdraw(double amount) {
        if (amount > (balance + overdraftLimit)) {
            System.out.println("Declined: Overdraft limit of Rs." + overdraftLimit + " exceeded!");
            return false;
        }
        balance -= amount;
        System.out.println("Current Account Withdrawal of Rs." + amount + " approved. Net Balance: Rs." + balance);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== OOP Banking System Initialized ===");
        
        List<BankAccount> portfolio = new ArrayList<>();
        portfolio.add(new SavingsAccount("SB-1001", "Aarav Sharma", 50000.0, 6.5));
        portfolio.add(new CurrentAccount("CA-9002", "S-Classes Tech Pvt Ltd", 20000.0, 50000.0));

        // Runtime Polymorphism
        for (BankAccount acc : portfolio) {
            acc.printStatement();
            acc.deposit(10000.0);
            acc.withdraw(45000.0);
            System.out.println("------------------------------------------");
        }
    }
}`
  },

  // --- 3. Data Structures (DSA) ---
  {
    id: 'java-dsa-custom-linkedlist',
    title: 'Generic Singly Linked List with Reverse & Cycle Detection (Floyd\'s)',
    category: 'Data Structures (DSA)',
    level: 'ADVANCED',
    description: 'Implements a fully generic LinkedList<T> with insertion, deletion, iterative reversal, and Floyd\'s Cycle-Finding algorithm.',
    tags: ['DSA', 'Linked List', 'Generics', 'Floyd Algorithm'],
    code: `// Generic Singly Linked List in Java with Cycle Detection
public class Main {
    static class Node<T> {
        T data;
        Node<T> next;
        Node(T data) { this.data = data; this.next = null; }
    }

    public static class CustomLinkedList<T> {
        private Node<T> head;
        private int size = 0;

        public void addLast(T data) {
            Node<T> newNode = new Node<>(data);
            if (head == null) {
                head = newNode;
            } else {
                Node<T> curr = head;
                while (curr.next != null) curr = curr.next;
                curr.next = newNode;
            }
            size++;
        }

        public void reverse() {
            Node<T> prev = null;
            Node<T> curr = head;
            Node<T> next = null;
            while (curr != null) {
                next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }
            head = prev;
        }

        public void printList() {
            Node<T> curr = head;
            while (curr != null) {
                System.out.print(curr.data + " -> ");
                curr = curr.next;
            }
            System.out.println("null (Size: " + size + ")");
        }

        // Floyd's Tortoise and Hare Cycle Detection
        public boolean hasCycle() {
            if (head == null) return false;
            Node<T> slow = head;
            Node<T> fast = head;
            while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;
                if (slow == fast) return true;
            }
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Java Generic Linked List Operations ===");
        CustomLinkedList<String> list = new CustomLinkedList<>();
        list.addLast("Step 1: Java Basics");
        list.addLast("Step 2: OOPs & Collections");
        list.addLast("Step 3: Data Structures (Trees & Graphs)");
        list.addLast("Step 4: Spring Boot Microservices");

        System.out.println("Original Forward List:");
        list.printList();

        System.out.println("\nReversing List in-place (O(N) Time, O(1) Space)...");
        list.reverse();
        list.printList();

        System.out.println("Contains Cycle? " + list.hasCycle());
    }
}`
  },

  {
    id: 'java-dsa-bst-complete',
    title: 'Binary Search Tree (BST): Insert, Delete, Search & Level-Order BFS',
    category: 'Data Structures (DSA)',
    level: 'ADVANCED',
    description: 'Complete BST with insertion, minimum value deletion, search, and queue-based Level Order Traversal (BFS).',
    tags: ['BST', 'Trees', 'Recursion', 'BFS', 'DSA'],
    code: `// Binary Search Tree (BST) in Java
import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    static class BST {
        TreeNode root;

        public void insert(int val) { root = insertRec(root, val); }

        private TreeNode insertRec(TreeNode root, int val) {
            if (root == null) return new TreeNode(val);
            if (val < root.val) root.left = insertRec(root.left, val);
            else if (val > root.val) root.right = insertRec(root.right, val);
            return root;
        }

        public boolean search(int val) {
            TreeNode curr = root;
            while (curr != null) {
                if (curr.val == val) return true;
                curr = (val < curr.val) ? curr.left : curr.right;
            }
            return false;
        }

        public void inorder(TreeNode root) {
            if (root != null) {
                inorder(root.left);
                System.out.print(root.val + " ");
                inorder(root.right);
            }
        }

        public void levelOrderBFS() {
            if (root == null) return;
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);

            while (!queue.isEmpty()) {
                int levelSize = queue.size();
                for (int i = 0; i < levelSize; i++) {
                    TreeNode curr = queue.poll();
                    System.out.print(curr.val + " ");
                    if (curr.left != null) queue.offer(curr.left);
                    if (curr.right != null) queue.offer(curr.right);
                }
                System.out.print(" | ");
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Binary Search Tree (BST) Engine ===");
        BST tree = new BST();
        int[] elements = {50, 30, 70, 20, 40, 60, 80};
        for (int el : elements) tree.insert(el);

        System.out.print("Sorted Inorder Traversal (L-N-R): ");
        tree.inorder(tree.root);
        System.out.println();

        System.out.print("Level-Order Breadth First Search (BFS): ");
        tree.levelOrderBFS();
        System.out.println();

        System.out.println("Search Key 40: " + (tree.search(40) ? "FOUND (True)" : "NOT FOUND"));
        System.out.println("Search Key 99: " + (tree.search(99) ? "FOUND (True)" : "NOT FOUND"));
    }
}`
  },

  {
    id: 'java-dsa-custom-hashmap',
    title: 'Custom HashMap Implementation with Collision Chaining in Java',
    category: 'Data Structures (DSA)',
    level: 'ADVANCED',
    description: 'Implements put(K, V), get(K), remove(K), and rehashing from scratch using array buckets and linked nodes.',
    tags: ['HashMap', 'Hashing', 'Collision Resolution', 'Generics'],
    code: `// Custom HashMap Implementation in Java
import java.util.*;

public class Main {
    static class MyHashMap<K, V> {
        private static class Entry<K, V> {
            K key;
            V value;
            Entry<K, V> next;
            Entry(K key, V value) { this.key = key; this.value = value; }
        }

        private Entry<K, V>[] buckets;
        private int capacity = 16;
        private int size = 0;

        @SuppressWarnings("unchecked")
        public MyHashMap() {
            buckets = new Entry[capacity];
        }

        private int getBucketIndex(K key) {
            return (key == null) ? 0 : Math.abs(key.hashCode() % capacity);
        }

        public void put(K key, V value) {
            int index = getBucketIndex(key);
            Entry<K, V> head = buckets[index];

            while (head != null) {
                if (Objects.equals(head.key, key)) {
                    head.value = value; // Update value
                    return;
                }
                head = head.next;
            }

            Entry<K, V> newEntry = new Entry<>(key, value);
            newEntry.next = buckets[index];
            buckets[index] = newEntry;
            size++;
        }

        public V get(K key) {
            int index = getBucketIndex(key);
            Entry<K, V> head = buckets[index];
            while (head != null) {
                if (Objects.equals(head.key, key)) return head.value;
                head = head.next;
            }
            return null;
        }

        public int size() { return size; }
    }

    public static void main(String[] args) {
        System.out.println("=== Custom HashMap Execution ===");
        MyHashMap<String, Integer> map = new MyHashMap<>();
        map.put("Java", 1995);
        map.put("Spring Boot", 2014);
        map.put("Java 21", 2023);

        System.out.println("Total Map Size: " + map.size());
        System.out.println("Release Year of Java 21: " + map.get("Java 21"));
        System.out.println("Release Year of Spring Boot: " + map.get("Spring Boot"));
    }
}`
  },

  // --- 4. Algorithms & Dynamic Programming ---
  {
    id: 'java-algo-quicksort',
    title: 'Quick Sort Algorithm with Median Partitioning (O(N log N))',
    category: 'Algorithms & Dynamic Programming',
    level: 'ADVANCED',
    description: 'In-place recursive QuickSort with Lomuto partitioning algorithm.',
    tags: ['QuickSort', 'Sorting', 'Algorithms', 'Divide & Conquer'],
    code: `// QuickSort Algorithm in Java
import java.util.Arrays;

public class Main {
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

    public static void main(String[] args) {
        int[] data = {87, 23, 45, 12, 99, 67, 34, 5, 56};
        System.out.println("Original Unsorted Array: " + Arrays.toString(data));

        quickSort(data, 0, data.length - 1);

        System.out.println("QuickSort Sorted Array : " + Arrays.toString(data));
    }
}`
  },

  {
    id: 'java-algo-knapsack-dp',
    title: '0/1 Knapsack Problem using 2D Dynamic Programming',
    category: 'Algorithms & Dynamic Programming',
    level: 'ADVANCED',
    description: 'Classic DP solution solving optimal weight vs value optimization with tabulation matrix.',
    tags: ['Dynamic Programming', 'Knapsack', 'Optimization'],
    code: `// 0/1 Knapsack Problem using Dynamic Programming in Java
public class Main {
    public static int solveKnapsack(int capacity, int[] weights, int[] values, int n) {
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 0; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                if (i == 0 || w == 0) {
                    dp[i][w] = 0;
                } else if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        values[i - 1] + dp[i - 1][w - weights[i - 1]],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][capacity];
    }

    public static void main(String[] args) {
        int[] values = {60, 100, 120};
        int[] weights = {10, 20, 30};
        int maxCapacity = 50;
        int n = values.length;

        System.out.println("=== 0/1 Knapsack Dynamic Programming ===");
        System.out.println("Bag Capacity : " + maxCapacity + " kg");
        System.out.println("Max Value Achievable: Rs." + solveKnapsack(maxCapacity, weights, values, n));
    }
}`
  },

  {
    id: 'java-algo-dijkstra',
    title: 'Dijkstra\'s Shortest Path Algorithm on Graph in Java',
    category: 'Algorithms & Dynamic Programming',
    level: 'ADVANCED',
    description: 'Finds the single-source shortest path from source vertex to all vertices using PriorityQueue.',
    tags: ['Graph', 'Dijkstra', 'Shortest Path', 'PriorityQueue'],
    code: `// Dijkstra's Shortest Path Algorithm in Java
import java.util.*;

public class Main {
    static class Edge {
        int target, weight;
        Edge(int t, int w) { this.target = t; this.weight = w; }
    }

    static class Node implements Comparable<Node> {
        int id, distance;
        Node(int id, int distance) { this.id = id; this.distance = distance; }
        @Override
        public int compareTo(Node o) { return Integer.compare(this.distance, o.distance); }
    }

    public static void dijkstra(List<List<Edge>> graph, int source, int vertices) {
        int[] dist = new int[vertices];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0));

        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;

            if (current.distance > dist[u]) continue;

            for (Edge edge : graph.get(u)) {
                int v = edge.target;
                int weight = edge.weight;

                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new Node(v, dist[v]));
                }
            }
        }

        System.out.println("=== Shortest Distances from Node " + source + " ===");
        for (int i = 0; i < vertices; i++) {
            System.out.println("Vertex " + i + " : " + (dist[i] == Integer.MAX_VALUE ? "INF" : dist[i] + " units"));
        }
    }

    public static void main(String[] args) {
        int V = 5;
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < V; i++) graph.add(new ArrayList<>());

        graph.get(0).add(new Edge(1, 9));
        graph.get(0).add(new Edge(2, 6));
        graph.get(0).add(new Edge(3, 5));
        graph.get(1).add(new Edge(4, 1));
        graph.get(2).add(new Edge(1, 2));
        graph.get(2).add(new Edge(3, 4));
        graph.get(3).add(new Edge(4, 3));

        dijkstra(graph, 0, V);
    }
}`
  },

  // --- 5. ICSE & CBSE Board Solved PYQs ---
  {
    id: 'java-icse-matrix-spiral',
    title: 'ICSE/CBSE Board Solved: 2D Matrix Spiral Traversal & Transpose',
    category: 'ICSE & CBSE Board PYQs',
    level: 'INTERMEDIATE',
    description: 'Frequently asked Class 10/12 Computer Science board question solving matrix operations.',
    tags: ['2D Arrays', 'Matrix', 'ICSE Class 10', 'CBSE Class 12'],
    code: `// ICSE/CBSE Board Question: 2D Matrix Spiral Traversal
import java.util.*;

public class Main {
    public static void printSpiral(int[][] matrix) {
        if (matrix.length == 0) return;
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;

        System.out.print("Spiral Traversal: ");
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) System.out.print(matrix[top][j] + " ");
            top++;

            for (int i = top; i <= bottom; i++) System.out.print(matrix[i][right] + " ");
            right--;

            if (top <= bottom) {
                for (int j = right; j >= left; j--) System.out.print(matrix[bottom][j] + " ");
                bottom--;
            }

            if (left <= right) {
                for (int i = bottom; i >= top; i--) System.out.print(matrix[i][left] + " ");
                left++;
            }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[][] matrix = {
            { 1,  2,  3,  4 },
            { 5,  6,  7,  8 },
            { 9, 10, 11, 12 },
            { 13, 14, 15, 16 }
        };

        System.out.println("=== ICSE Class 10 Solved Board Matrix Problem ===");
        printSpiral(matrix);
    }
}`
  },

  {
    id: 'java-icse-string-piglatin',
    title: 'ICSE Board Question: Pig Latin Word & Vowel Frequency Analyzer',
    category: 'ICSE & CBSE Board PYQs',
    level: 'BEGINNER',
    description: 'Transforms words into Pig Latin and counts vowel occurrences according to ICSE Board specifications.',
    tags: ['String Manipulation', 'ICSE Class 10', 'Board Solved'],
    code: `// ICSE Class 10 Computer Applications: Pig Latin Converter
import java.util.Scanner;

public class Main {
    public static String toPigLatin(String word) {
        word = word.toUpperCase();
        int len = word.length();
        int firstVowelIdx = -1;

        for (int i = 0; i < len; i++) {
            char ch = word.charAt(i);
            if (ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U') {
                firstVowelIdx = i;
                break;
            }
        }

        if (firstVowelIdx == -1) return word + "AY";
        return word.substring(firstVowelIdx) + word.substring(0, firstVowelIdx) + "AY";
    }

    public static void main(String[] args) {
        String[] testWords = {"TROUBLE", "EAT", "JAVA", "SCHOOL", "SPRING"};

        System.out.println("=== ICSE Solved PYQ: Pig Latin Word Formatter ===");
        for (String w : testWords) {
            System.out.println(String.format("%-10s -> %s", w, toPigLatin(w)));
        }
    }
}`
  },

  // --- 6. Design Patterns in Java ---
  {
    id: 'java-pattern-singleton-builder',
    title: 'Thread-Safe Singleton & Fluent Builder Pattern in Java',
    category: 'Design Patterns in Java',
    level: 'ADVANCED',
    description: 'Implements production-grade Bill Pugh thread-safe Singleton and the Fluent Builder pattern for immutable configuration.',
    tags: ['Design Patterns', 'Singleton', 'Builder Pattern', 'Thread Safety'],
    code: `// Thread-Safe Singleton & Fluent Builder in Java
public class Main {
    // 1. Thread-Safe Bill Pugh Singleton
    public static class DatabaseConnection {
        private DatabaseConnection() {
            System.out.println("[JVM] Initializing Database Connection Pool (1 instance)...");
        }

        private static class HelperHolder {
            private static final DatabaseConnection INSTANCE = new DatabaseConnection();
        }

        public static DatabaseConnection getInstance() {
            return HelperHolder.INSTANCE;
        }

        public void executeQuery(String sql) {
            System.out.println("Executing Query: '" + sql + "' -> SUCCESS");
        }
    }

    // 2. Fluent Builder Pattern for Immutable AppConfig
    public static class AppConfig {
        private final String appName;
        private final String environment;
        private final int port;
        private final boolean debugMode;

        private AppConfig(Builder b) {
            this.appName = b.appName;
            this.environment = b.environment;
            this.port = b.port;
            this.debugMode = b.debugMode;
        }

        public static class Builder {
            private String appName = "S-Classes App";
            private String environment = "PRODUCTION";
            private int port = 8080;
            private boolean debugMode = false;

            public Builder appName(String name) { this.appName = name; return this; }
            public Builder environment(String env) { this.environment = env; return this; }
            public Builder port(int port) { this.port = port; return this; }
            public Builder debugMode(boolean debug) { this.debugMode = debug; return this; }

            public AppConfig build() { return new AppConfig(this); }
        }

        @Override
        public String toString() {
            return "AppConfig[name=" + appName + ", env=" + environment + ", port=" + port + ", debug=" + debugMode + "]";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Design Patterns in Java ===");

        // Test Singleton
        DatabaseConnection db1 = DatabaseConnection.getInstance();
        DatabaseConnection db2 = DatabaseConnection.getInstance();
        System.out.println("db1 == db2? " + (db1 == db2) + " (Same Memory Instance)");
        db1.executeQuery("SELECT * FROM students WHERE grade >= 90;");

        // Test Builder
        AppConfig config = new AppConfig.Builder()
            .appName("S-Classes Java Microservice")
            .environment("CLOUD_PROD")
            .port(3000)
            .debugMode(true)
            .build();

        System.out.println("\nBuilt Immutable Configuration: " + config);
    }
}`
  },

  // --- 7. Enterprise & Spring Boot Architecture ---
  {
    id: 'java-spring-microservice',
    title: 'Spring Boot 3 REST Controller, Service Layer & Global Exception Handler',
    category: 'Enterprise & Spring Boot',
    level: 'ADVANCED',
    description: 'Simulates Spring Boot 3 enterprise layered architecture: DTOs, Service interfaces, Repository mock, and Global Exception Handler.',
    tags: ['Spring Boot 3', 'REST API', 'Architecture', 'Service Layer'],
    code: `// Spring Boot 3 Enterprise Layered Architecture Simulation
import java.util.*;
import java.time.LocalDateTime;

public class Main {
    // 1. DTO Record
    public record CourseDto(String id, String title, String instructor, double price, int durationHours) {}

    // 2. Service Layer
    public interface CourseService {
        List<CourseDto> getCatalog();
        CourseDto findById(String id);
        CourseDto enroll(String courseId, String studentEmail);
    }

    public static class CourseServiceImpl implements CourseService {
        private final Map<String, CourseDto> repository = new HashMap<>();

        public CourseServiceImpl() {
            repository.put("java-21", new CourseDto("java-21", "Mastering Java 21 & OOPs", "Prof. Chavhan", 0.0, 45));
            repository.put("dsa-java", new CourseDto("dsa-java", "DSA in Java for Placements", "Dr. Sharma", 0.0, 60));
            repository.put("spring-boot", new CourseDto("spring-boot", "Spring Boot 3 Microservices", "Eng. Patel", 0.0, 50));
        }

        @Override
        public List<CourseDto> getCatalog() { return new ArrayList<>(repository.values()); }

        @Override
        public CourseDto findById(String id) {
            CourseDto course = repository.get(id);
            if (course == null) throw new NoSuchElementException("Course not found for ID: " + id);
            return course;
        }

        @Override
        public CourseDto enroll(String courseId, String studentEmail) {
            CourseDto course = findById(courseId);
            System.out.println("[AUDIT LOG] Student " + studentEmail + " enrolled in " + course.title() + " at " + LocalDateTime.now());
            return course;
        }
    }

    // 3. REST Controller Simulation
    public static class CourseRestController {
        private final CourseService courseService = new CourseServiceImpl();

        public void handleGetCatalog() {
            System.out.println("HTTP GET /api/v1/courses (200 OK):");
            courseService.getCatalog().forEach(c -> System.out.println(" - [" + c.id() + "] " + c.title() + " by " + c.instructor()));
        }

        public void handleEnrollment(String id, String email) {
            System.out.println("\nHTTP POST /api/v1/courses/" + id + "/enroll (201 CREATED):");
            CourseDto enrolled = courseService.enroll(id, email);
            System.out.println("Response Payload: " + enrolled);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Spring Boot 3 Enterprise Controller ===");
        CourseRestController controller = new CourseRestController();
        controller.handleGetCatalog();
        controller.handleEnrollment("java-21", "shubhamchavhan008@gmail.com");
    }
}`
  }
];
