package com.sclasses.enterprise;

import java.util.*;

/**
 * University Academic Records, CGPA & Credit Engine in Java 21
 */
public class StudentGradingSystem {

    public record CourseGrade(String courseCode, String courseName, int credits, double marks) {
        public double getGradePoint() {
            if (marks >= 90) return 10.0;
            if (marks >= 80) return 9.0;
            if (marks >= 70) return 8.0;
            if (marks >= 60) return 7.0;
            if (marks >= 50) return 6.0;
            return 0.0;
        }

        public String getLetterGrade() {
            if (marks >= 90) return "O (Outstanding)";
            if (marks >= 80) return "A+ (Excellent)";
            if (marks >= 70) return "A (Very Good)";
            if (marks >= 60) return "B+ (Good)";
            if (marks >= 50) return "B (Pass)";
            return "F (Fail)";
        }
    }

    public static class StudentRecord {
        private final String rollNo;
        private final String name;
        private final String department;
        private final List<CourseGrade> courses = new ArrayList<>();

        public StudentRecord(String rollNo, String name, String department) {
            this.rollNo = rollNo;
            this.name = name;
            this.department = department;
        }

        public void addGrade(CourseGrade cg) { courses.add(cg); }

        public double calculateCGPA() {
            int totalCredits = 0;
            double weightedSum = 0;
            for (CourseGrade c : courses) {
                totalCredits += c.credits();
                weightedSum += (c.credits() * c.getGradePoint());
            }
            return totalCredits == 0 ? 0.0 : weightedSum / totalCredits;
        }

        public void generateTranscript() {
            System.out.println("  ================ ACADEMIC TRANSCRIPT ================");
            System.out.printf("  Roll No   : %s%n", rollNo);
            System.out.printf("  Name      : %s%n", name);
            System.out.printf("  Department: %s%n", department);
            System.out.println("  ----------------------------------------------------");
            for (CourseGrade cg : courses) {
                System.out.printf("  %-7s | %-24s | Credits: %d | Marks: %5.1f | %s%n",
                    cg.courseCode(), cg.courseName(), cg.credits(), cg.marks(), cg.getLetterGrade());
            }
            System.out.println("  ----------------------------------------------------");
            System.out.printf("  CUMULATIVE GPA (CGPA): %.2f / 10.00%n", calculateCGPA());
            System.out.println("  ====================================================\n");
        }
    }

    public static void runDemo() {
        StudentRecord student = new StudentRecord("CS-2026-088", "Shubham Chavhan", "Computer Science & Engineering");
        student.addGrade(new CourseGrade("CS501", "Java 21 & JVM Systems", 4, 96.5));
        student.addGrade(new CourseGrade("CS502", "Data Structures & Algos", 4, 92.0));
        student.addGrade(new CourseGrade("CS503", "Spring Boot & Cloud", 3, 88.5));
        student.addGrade(new CourseGrade("CS504", "Database Architecture", 3, 94.0));
        student.generateTranscript();
    }
}
