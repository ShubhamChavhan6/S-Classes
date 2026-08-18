package com.sclasses.core;

import java.util.List;

/**
 * Demonstrates:
 * - Sealed Classes & Pattern Matching for Switch (Java 21)
 * - Record Types with Compact Constructors
 * - Dynamic Method Dispatch (Runtime Polymorphism)
 * - Abstract Classes and Interface Default Methods
 * - Custom Exceptions & Multi-Catch Blocks
 */
public class OOPPrinciples {

    // 1. Sealed Interface hierarchy
    public sealed interface PaymentMethod permits CreditCard, UPI, NetBanking {
        double processPayment(double amount);
    }

    public record CreditCard(String cardNumber, String holderName, double feePercentage) implements PaymentMethod {
        public CreditCard {
            if (cardNumber == null || cardNumber.length() < 12) {
                throw new IllegalArgumentException("Invalid Credit Card Number");
            }
        }

        @Override
        public double processPayment(double amount) {
            double total = amount + (amount * feePercentage / 100.0);
            System.out.printf("  [CreditCard] Charged ₹%.2f (Card ending with %s)%n", total, cardNumber.substring(cardNumber.length() - 4));
            return total;
        }
    }

    public record UPI(String vpaId, String bankName) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("  [UPI] Instant Zero-Fee ₹%.2f to %s (%s)%n", amount, vpaId, bankName);
            return amount;
        }
    }

    public record NetBanking(String customerId, String ifscCode) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("  [NetBanking] Transferred ₹%.2f via IFSC %s%n", amount, ifscCode);
            return amount;
        }
    }

    // Pattern Matching for Switch
    public static void auditPayment(PaymentMethod payment) {
        String result = switch (payment) {
            case CreditCard cc -> "Card Audit: Holder=" + cc.holderName() + ", Fee=" + cc.feePercentage() + "%";
            case UPI upi -> "UPI Audit: VPA=" + upi.vpaId() + ", Routing Bank=" + upi.bankName();
            case NetBanking nb -> "NetBanking Audit: CustID=" + nb.customerId() + ", IFSC=" + nb.ifscCode();
        };
        System.out.println("  • " + result);
    }

    public static void runDemo() {
        System.out.println("--- 1. Java 21 Sealed Interfaces & Records ---");
        List<PaymentMethod> payments = List.of(
            new CreditCard("4111222233334444", "Shubham Chavhan", 1.75),
            new UPI("shubham@okaxis", "Axis Bank"),
            new NetBanking("CUST-99210", "HDFC0001234")
        );

        for (PaymentMethod p : payments) {
            p.processPayment(2500.0);
            auditPayment(p);
        }
    }
}
