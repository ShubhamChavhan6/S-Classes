// src/data/javaProjectBlueprints.js

export const JAVA_PROJECT_BLUEPRINTS = [
  {
    id: 'proj-banking-erp',
    name: 'Core Banking & Multi-Account Transaction Management System',
    description: 'A full OOP Java 21 banking system with accounts, interest calculator, ledger audits, concurrency locks, and transaction history.',
    category: 'Enterprise Finance',
    filesCount: 4,
    mainClassName: 'BankApplication',
    code: `/**
 * S-Classes Enterprise Java 21 Project:
 * Core Banking & Multi-Account Transaction System
 */
import java.util.*;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

// 1. Transaction Model
record Transaction(String transactionId, String fromAcc, String toAcc, double amount, String type, LocalDateTime timestamp) {}

// 2. Custom Exception
class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String msg) { super(msg); }
}

// 3. Bank Account Abstraction
abstract class Account {
    private final String accountNumber;
    private final String customerName;
    protected double balance;
    protected final List<Transaction> history = new ArrayList<>();

    public Account(String accNo, String name, double initialBalance) {
        this.accountNumber = accNo;
        this.customerName = name;
        this.balance = initialBalance;
    }

    public String getAccountNumber() { return accountNumber; }
    public String getCustomerName() { return customerName; }
    public synchronized double getBalance() { return balance; }

    public synchronized void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
        Transaction tx = new Transaction(UUID.randomUUID().toString().substring(0, 8), "CASH_DEPOSIT", accountNumber, amount, "CREDIT", LocalDateTime.now());
        history.add(tx);
        System.out.println("✅ [DEPOSIT] Account " + accountNumber + " credited with Rs." + amount + " | Balance: Rs." + balance);
    }

    public abstract void withdraw(double amount) throws InsufficientBalanceException;

    public void printMiniStatement() {
        System.out.println("\n--- Mini Statement for " + customerName + " (" + accountNumber + ") ---");
        System.out.println("Current Balance: Rs." + balance);
        System.out.println("Transactions Recorded: " + history.size());
        history.forEach(tx -> System.out.println(" • " + tx.type() + " Rs." + tx.amount() + " on " + tx.timestamp()));
    }
}

// 4. Savings Account Implementation
class SavingsAccount extends Account {
    private final double annualInterestRate;

    public SavingsAccount(String accNo, String name, double bal, double interestRate) {
        super(accNo, name, bal);
        this.annualInterestRate = interestRate;
    }

    @Override
    public synchronized void withdraw(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException("Insufficient funds! Requested: Rs." + amount + ", Available: Rs." + balance);
        }
        balance -= amount;
        Transaction tx = new Transaction(UUID.randomUUID().toString().substring(0, 8), accountNumber, "ATM_WITHDRAWAL", amount, "DEBIT", LocalDateTime.now());
        history.add(tx);
        System.out.println("🏧 [WITHDRAW] Rs." + amount + " debited from " + getAccountNumber() + " | New Balance: Rs." + balance);
    }

    public void creditInterest() {
        double interest = balance * (annualInterestRate / 100.0);
        deposit(interest);
        System.out.println("✨ [INTEREST] Credited Rs." + String.format("%.2f", interest) + " (Rate: " + annualInterestRate + "%)");
    }
}

// 5. Central Bank Operations Engine
class BankService {
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();

    public void openAccount(Account acc) {
        accounts.put(acc.getAccountNumber(), acc);
        System.out.println("🏛️ Account " + acc.getAccountNumber() + " opened for " + acc.getCustomerName());
    }

    public synchronized void transferFunds(String fromAccNo, String toAccNo, double amount) throws InsufficientBalanceException {
        Account from = accounts.get(fromAccNo);
        Account to = accounts.get(toAccNo);

        if (from == null || to == null) throw new NoSuchElementException("One or both accounts do not exist");

        System.out.println("\n⚡ Initiating Inter-Bank Transfer of Rs." + amount + " from " + fromAccNo + " to " + toAccNo + "...");
        from.withdraw(amount);
        to.deposit(amount);
        System.out.println("🎉 [TRANSFER COMPLETE] Funds settled successfully!");
    }
}

// 6. Application Main
public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   S-CLASSES ENTERPRISE BANKING CORE ENGINE       ");
        System.out.println("==================================================");

        BankService bank = new BankService();
        SavingsAccount acc1 = new SavingsAccount("SB-1001", "Aarav Sharma", 75000.0, 7.2);
        SavingsAccount acc2 = new SavingsAccount("SB-1002", "Priya Patel", 30000.0, 7.2);

        bank.openAccount(acc1);
        bank.openAccount(acc2);

        acc1.deposit(15000.0);
        acc1.creditInterest();

        try {
            bank.transferFunds("SB-1001", "SB-1002", 25000.0);
        } catch (InsufficientBalanceException e) {
            System.err.println("❌ Transfer Failed: " + e.getMessage());
        }

        acc1.printMiniStatement();
        acc2.printMiniStatement();
    }
}`
  },

  {
    id: 'proj-student-erp',
    name: 'University Student Academic Records & Grading System',
    description: 'Complete Java student information system with GPA calculation, attendance tracking, and course enrollment validation.',
    category: 'Educational Technology',
    filesCount: 3,
    mainClassName: 'StudentInformationSystem',
    code: `/**
 * S-Classes Academic ERP: Student Records & GPA System
 */
import java.util.*;

record Course(String code, String title, int credits) {}

class Student {
    private final String rollNumber;
    private final String name;
    private final Map<Course, Double> courseMarks = new HashMap<>();

    public Student(String rollNumber, String name) {
        this.rollNumber = rollNumber;
        this.name = name;
    }

    public String getRollNumber() { return rollNumber; }
    public String getName() { return name; }

    public void assignMarks(Course course, double marks) {
        courseMarks.put(course, marks);
    }

    public double calculateGPA() {
        if (courseMarks.isEmpty()) return 0.0;
        double totalGradePoints = 0;
        int totalCredits = 0;

        for (var entry : courseMarks.entrySet()) {
            Course c = entry.getKey();
            double marks = entry.getValue();
            double gradePoint = marks >= 90 ? 10.0 : marks >= 80 ? 9.0 : marks >= 70 ? 8.0 : marks >= 60 ? 7.0 : 5.0;
            totalGradePoints += (gradePoint * c.credits());
            totalCredits += c.credits();
        }
        return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0.0;
    }

    public void printReportCard() {
        System.out.println("\n╔════════════════════════════════════════════════════════╗");
        System.out.println("  ACADEMIC TRANSCRIPT: " + name + " (Roll: " + rollNumber + ")");
        System.out.println("╠════════════════════════════════════════════════════════╣");
        courseMarks.forEach((course, marks) -> {
            System.out.println(String.format("  [%-8s] %-28s : %5.1f/100", course.code(), course.title(), marks));
        });
        System.out.println("╠════════════════════════════════════════════════════════╣");
        System.out.println(String.format("  Cumulative GPA (CGPA) : %4.2f / 10.00", calculateGPA()));
        System.out.println("  Status : " + (calculateGPA() >= 8.5 ? "FIRST CLASS WITH DISTINCTION ⭐" : "PASSED"));
        System.out.println("╚════════════════════════════════════════════════════════╝");
    }
}

public class Main {
    public static void main(String[] args) {
        Course javaCore = new Course("CS-301", "Java 21 Core & OOPs", 4);
        Course dsa = new Course("CS-302", "Data Structures in Java", 4);
        Course spring = new Course("CS-303", "Spring Boot Microservices", 3);
        Course math = new Course("MA-101", "Discrete Mathematics", 3);

        Student s1 = new Student("S-2026-001", "Aarav Sharma");
        s1.assignMarks(javaCore, 96.0);
        s1.assignMarks(dsa, 92.5);
        s1.assignMarks(spring, 94.0);
        s1.assignMarks(math, 88.0);

        Student s2 = new Student("S-2026-002", "Priya Patel");
        s2.assignMarks(javaCore, 98.0);
        s2.assignMarks(dsa, 95.0);
        s2.assignMarks(spring, 91.0);
        s2.assignMarks(math, 93.0);

        System.out.println("=== University Academic ERP Engine ===");
        s1.printReportCard();
        s2.printReportCard();
    }
}`
  },

  {
    id: 'proj-ecommerce-cart',
    name: 'E-Commerce Shopping Cart, Coupon & Payment Pipeline',
    description: 'Production-ready Java e-commerce engine with discount coupon strategies, inventory decrement, and invoice generation.',
    category: 'E-Commerce & Retail',
    filesCount: 4,
    mainClassName: 'EcommerceApp',
    code: `/**
 * S-Classes E-Commerce Cart & Discount Engine
 */
import java.util.*;

record Product(String id, String name, double price, String category) {}

class CartItem {
    private final Product product;
    private int quantity;

    public CartItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public Product getProduct() { return product; }
    public int getQuantity() { return quantity; }
    public double getTotalPrice() { return product.price() * quantity; }
}

interface DiscountStrategy {
    double applyDiscount(double subtotal);
}

class FestiveDiscountStrategy implements DiscountStrategy {
    @Override
    public double applyDiscount(double subtotal) {
        if (subtotal >= 5000.0) return subtotal * 0.15; // 15% discount
        if (subtotal >= 2000.0) return subtotal * 0.10; // 10% discount
        return 0.0;
    }
}

class ShoppingCart {
    private final List<CartItem> items = new ArrayList<>();
    private DiscountStrategy discountStrategy = subtotal -> 0.0;

    public void addItem(Product product, int quantity) {
        items.add(new CartItem(product, quantity));
        System.out.println("🛒 Added to Cart: " + quantity + "x " + product.name() + " (Rs." + product.price() + " each)");
    }

    public void setDiscountStrategy(DiscountStrategy strategy) {
        this.discountStrategy = strategy;
    }

    public void generateInvoice() {
        double subtotal = items.stream().mapToDouble(CartItem::getTotalPrice).sum();
        double discount = discountStrategy.applyDiscount(subtotal);
        double tax = (subtotal - discount) * 0.18; // 18% GST
        double grandTotal = (subtotal - discount) + tax;

        System.out.println("\n══════════════════════════════════════════════════════");
        System.out.println("               TAX INVOICE & ORDER SUMMARY            ");
        System.out.println("══════════════════════════════════════════════════════");
        items.forEach(item -> {
            System.out.println(String.format(" %-24s x %2d = Rs.%8.2f", 
                item.getProduct().name(), item.getQuantity(), item.getTotalPrice()));
        });
        System.out.println("──────────────────────────────────────────────────────");
        System.out.println(String.format(" Subtotal               : Rs.%8.2f", subtotal));
        System.out.println(String.format(" Coupon Savings         : -Rs.%7.2f", discount));
        System.out.println(String.format(" GST (18%%)              : +Rs.%7.2f", tax));
        System.out.println("──────────────────────────────────────────────────────");
        System.out.println(String.format(" FINAL PAYABLE AMOUNT   : Rs.%8.2f", grandTotal));
        System.out.println("══════════════════════════════════════════════════════");
    }
}

public class Main {
    public static void main(String[] args) {
        Product p1 = new Product("P101", "Java 21 Masterclass Book", 1499.0, "Books");
        Product p2 = new Product("P102", "S-Classes Mechanical Keyboard", 3999.0, "Hardware");
        Product p3 = new Product("P103", "Wireless Noise-Cancelling Buds", 2499.0, "Audio");

        ShoppingCart cart = new ShoppingCart();
        cart.addItem(p1, 2);
        cart.addItem(p2, 1);
        cart.addItem(p3, 1);

        cart.setDiscountStrategy(new FestiveDiscountStrategy());
        cart.generateInvoice();
    }
}`
  }
];
