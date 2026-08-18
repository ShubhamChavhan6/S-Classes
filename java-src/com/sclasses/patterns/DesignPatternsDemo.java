package com.sclasses.patterns;

import java.util.ArrayList;
import java.util.List;

/**
 * Modern Gang of Four (GoF) Design Patterns in Java 21:
 * 1. Bill Pugh Thread-Safe Singleton
 * 2. Fluent Builder Pattern
 * 3. Observer / Event Listener Pattern
 */
public class DesignPatternsDemo {

    // 1. Thread-Safe Bill Pugh Singleton
    public static class AppConfiguration {
        private AppConfiguration() {
            System.out.println("  [Singleton] Initializing AppConfiguration instance once...");
        }

        private static class HelperHolder {
            private static final AppConfiguration INSTANCE = new AppConfiguration();
        }

        public static AppConfiguration getInstance() {
            return HelperHolder.INSTANCE;
        }

        public void printConfig() {
            System.out.println("  [Singleton] Configuration active: Env=PROD, Java=21 LTS, Region=asia-south1");
        }
    }

    // 2. Fluent Builder Pattern
    public static class EmailNotification {
        private final String recipient;
        private final String subject;
        private final String body;
        private final boolean isHtml;
        private final List<String> attachments;

        private EmailNotification(Builder b) {
            this.recipient = b.recipient;
            this.subject = b.subject;
            this.body = b.body;
            this.isHtml = b.isHtml;
            this.attachments = b.attachments;
        }

        public static class Builder {
            private String recipient;
            private String subject;
            private String body;
            private boolean isHtml = false;
            private List<String> attachments = new ArrayList<>();

            public Builder to(String recipient) { this.recipient = recipient; return this; }
            public Builder subject(String subject) { this.subject = subject; return this; }
            public Builder body(String body) { this.body = body; return this; }
            public Builder html(boolean isHtml) { this.isHtml = isHtml; return this; }
            public Builder addAttachment(String file) { this.attachments.add(file); return this; }

            public EmailNotification build() {
                if (recipient == null || subject == null) {
                    throw new IllegalStateException("Recipient and Subject are required");
                }
                return new EmailNotification(this);
            }
        }

        public void send() {
            System.out.printf("  [Builder] Sent Email to '%s' | Subject: '%s' | Attachments: %d%n",
                recipient, subject, attachments.size());
        }
    }

    // 3. Observer Pattern
    public interface ExamObserver {
        void onExamScheduled(String examName, String date);
    }

    public static class StudentNotificationSubscriber implements ExamObserver {
        private final String studentName;
        public StudentNotificationSubscriber(String name) { this.studentName = name; }

        @Override
        public void onExamScheduled(String examName, String date) {
            System.out.printf("  [Observer] Notified %s: '%s' is scheduled for %s%n", studentName, examName, date);
        }
    }

    public static class ExaminationOffice {
        private final List<ExamObserver> observers = new ArrayList<>();

        public void subscribe(ExamObserver observer) { observers.add(observer); }

        public void publishExam(String examName, String date) {
            System.out.printf("  [Office] Publishing Exam Notice: '%s' on %s%n", examName, date);
            for (ExamObserver o : observers) {
                o.onExamScheduled(examName, date);
            }
        }
    }

    public static void runDemo() {
        System.out.println("--- 1. Bill Pugh Singleton Pattern ---");
        AppConfiguration config1 = AppConfiguration.getInstance();
        AppConfiguration config2 = AppConfiguration.getInstance();
        System.out.println("  Same instance check (config1 == config2)? " + (config1 == config2));
        config1.printConfig();

        System.out.println("\n--- 2. Fluent Builder Pattern ---");
        EmailNotification email = new EmailNotification.Builder()
            .to("student@sclasses.com")
            .subject("Java 21 Certificate of Excellence")
            .body("Congratulations on completing Java 21 Mastery Course!")
            .html(true)
            .addAttachment("Certificate_Java21.pdf")
            .build();
        email.send();

        System.out.println("\n--- 3. Observer Pattern ---");
        ExaminationOffice office = new ExaminationOffice();
        office.subscribe(new StudentNotificationSubscriber("Shubham"));
        office.subscribe(new StudentNotificationSubscriber("Priya"));
        office.publishExam("Java 21 & Spring Boot Final Assessment", "2026-09-15");
    }
}
