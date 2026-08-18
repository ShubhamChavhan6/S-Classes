package com.sclasses.enterprise;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Enterprise Core Banking & Ledger Architecture in Java 21:
 * - Thread-Safe Account Transfers with ReentrantLocks
 * - Immutable Audit Ledger Records
 * - Strict Invariant & Balance Integrity Validation
 */
public class BankingSystem {

    public record Transaction(
        String transactionId,
        String fromAccount,
        String toAccount,
        double amount,
        String status,
        LocalDateTime timestamp
    ) {}

    public static class BankAccount {
        private final String accountNumber;
        private final String accountHolder;
        private double balance;
        private final ReentrantLock lock = new ReentrantLock();

        public BankAccount(String accountNumber, String accountHolder, double initialBalance) {
            this.accountNumber = accountNumber;
            this.accountHolder = accountHolder;
            this.balance = initialBalance;
        }

        public String getAccountNumber() { return accountNumber; }
        public String getAccountHolder() { return accountHolder; }
        public double getBalance() { return balance; }

        public void deposit(double amount) {
            lock.lock();
            try {
                if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
                balance += amount;
            } finally {
                lock.unlock();
            }
        }

        public boolean withdraw(double amount) {
            lock.lock();
            try {
                if (amount <= 0 || amount > balance) return false;
                balance -= amount;
                return true;
            } finally {
                lock.unlock();
            }
        }
    }

    public static class BankEngine {
        private final Map<String, BankAccount> accounts = new HashMap<>();
        private final List<Transaction> ledger = new ArrayList<>();

        public void registerAccount(BankAccount account) {
            accounts.put(account.getAccountNumber(), account);
        }

        public synchronized boolean transfer(String fromAcc, String toAcc, double amount) {
            BankAccount src = accounts.get(fromAcc);
            BankAccount dest = accounts.get(toAcc);

            if (src == null || dest == null) return false;

            if (src.withdraw(amount)) {
                dest.deposit(amount);
                Transaction tx = new Transaction(
                    "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    fromAcc,
                    toAcc,
                    amount,
                    "SUCCESS",
                    LocalDateTime.now()
                );
                ledger.add(tx);
                System.out.printf("  ✓ Transferred ₹%.2f from %s (%s) to %s (%s) [TXN: %s]%n",
                    amount, src.getAccountHolder(), fromAcc, dest.getAccountHolder(), toAcc, tx.transactionId());
                return true;
            } else {
                System.out.printf("  ✗ FAILED: Insufficient funds in %s for ₹%.2f transfer%n", fromAcc, amount);
                return false;
            }
        }

        public void printSummary() {
            System.out.println("  ---------------- CURRENT LEDGER STATE ----------------");
            for (BankAccount acc : accounts.values()) {
                System.out.printf("  Account %s | Holder: %-16s | Balance: ₹%,10.2f%n",
                    acc.getAccountNumber(), acc.getAccountHolder(), acc.getBalance());
            }
        }
    }

    public static void runDemo() {
        System.out.println("--- 1. Enterprise Banking Engine Execution ---");
        BankEngine bank = new BankEngine();

        BankAccount acc1 = new BankAccount("SB-1001", "Shubham Chavhan", 50000.00);
        BankAccount acc2 = new BankAccount("SB-1002", "Priya Sharma", 15000.00);
        BankAccount acc3 = new BankAccount("SB-1003", "Amit Verma", 8000.00);

        bank.registerAccount(acc1);
        bank.registerAccount(acc2);
        bank.registerAccount(acc3);

        bank.printSummary();

        System.out.println("\n  Executing Transactions:");
        bank.transfer("SB-1001", "SB-1002", 12500.00);
        bank.transfer("SB-1002", "SB-1003", 5000.00);
        bank.transfer("SB-1003", "SB-1001", 20000.00); // Should fail

        bank.printSummary();
    }
}
