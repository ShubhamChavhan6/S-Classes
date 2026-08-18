package com.sclasses.backend.ui.views;

import com.sclasses.backend.ui.MainLayout;
import java.io.Serializable;
import java.util.List;

/**
 * Vaadin Pure Java Dashboard View.
 * Renders live student metrics, course enrollments, learning streaks, and quick launch pads.
 */
public class DashboardView implements MainLayout.Component, Serializable {
    private static final long serialVersionUID = 1L;

    private final String id = "view-dashboard";
    private final String studentName;
    private final int streakDays;
    private final int completedLessons;
    private final double gpaScore;
    private final List<String> enrolledCourses;

    public DashboardView(String studentName, int streakDays, int completedLessons, double gpaScore, List<String> enrolledCourses) {
        this.studentName = studentName;
        this.streakDays = streakDays;
        this.completedLessons = completedLessons;
        this.gpaScore = gpaScore;
        this.enrolledCourses = enrolledCourses != null ? List.copyOf(enrolledCourses) : List.of();
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String renderHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='vaadin-dashboard-container'>\n");
        sb.append("  <header class='dashboard-header'>\n");
        sb.append("    <h1>Welcome back, ").append(escapeHtml(studentName)).append("!</h1>\n");
        sb.append("    <p class='subtitle'>Your Personalized S-Classes AI Learning Dashboard</p>\n");
        sb.append("  </header>\n");
        sb.append("  <div class='metrics-grid'>\n");
        sb.append("    <div class='metric-card'><span class='metric-val'>").append(streakDays).append(" 🔥</span><span class='metric-lbl'>Daily Streak</span></div>\n");
        sb.append("    <div class='metric-card'><span class='metric-val'>").append(completedLessons).append(" 📚</span><span class='metric-lbl'>Lessons Mastered</span></div>\n");
        sb.append("    <div class='metric-card'><span class='metric-val'>").append(String.format("%.1f", gpaScore)).append(" 🌟</span><span class='metric-lbl'>Academic Score</span></div>\n");
        sb.append("  </div>\n");
        sb.append("  <section class='enrolled-section'>\n");
        sb.append("    <h2>Active Enrollments (").append(enrolledCourses.size()).append(")</h2>\n");
        sb.append("    <ul class='course-list'>\n");
        for (String c : enrolledCourses) {
            sb.append("      <li class='course-item'>").append(escapeHtml(c)).append("</li>\n");
        }
        sb.append("    </ul>\n");
        sb.append("  </section>\n");
        sb.append("</div>");
        return sb.toString();
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    public String getStudentName() { return studentName; }
    public int getStreakDays() { return streakDays; }
    public int getCompletedLessons() { return completedLessons; }
    public double getGpaScore() { return gpaScore; }
    public List<String> getEnrolledCourses() { return enrolledCourses; }
}
