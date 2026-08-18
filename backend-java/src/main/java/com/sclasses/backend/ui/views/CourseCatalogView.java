package com.sclasses.backend.ui.views;

import com.sclasses.backend.ui.MainLayout;
import java.io.Serializable;
import java.util.List;

/**
 * Vaadin Pure Java Course Catalog View.
 * Displays interactive course filtering, enrollment modals, and curriculum breakdowns.
 */
public class CourseCatalogView implements MainLayout.Component, Serializable {
    private static final long serialVersionUID = 1L;

    public record CourseItem(String id, String title, String category, String level, double rating, int lessonsCount) implements Serializable {}

    private final String id = "view-course-catalog";
    private final List<CourseItem> courses;
    private String selectedCategory = "ALL";

    public CourseCatalogView(List<CourseItem> courses) {
        this.courses = courses != null ? List.copyOf(courses) : List.of();
    }

    @Override
    public String getId() {
        return id;
    }

    public void filterByCategory(String category) {
        this.selectedCategory = category != null ? category.toUpperCase() : "ALL";
    }

    @Override
    public String renderHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='vaadin-catalog-container'>\n");
        sb.append("  <div class='catalog-header'>\n");
        sb.append("    <h2>📚 Comprehensive Course Catalog</h2>\n");
        sb.append("    <p>Browse CBSE, ICSE, JEE/NEET, Coding, and Language tracks</p>\n");
        sb.append("  </div>\n");
        sb.append("  <div class='courses-grid'>\n");
        for (CourseItem c : courses) {
            if ("ALL".equals(selectedCategory) || c.category().equalsIgnoreCase(selectedCategory)) {
                sb.append("    <article class='course-card'>\n");
                sb.append("      <div class='badge'>").append(c.category()).append(" &bull; ").append(c.level()).append("</div>\n");
                sb.append("      <h3>").append(c.title()).append("</h3>\n");
                sb.append("      <div class='meta'><span>⭐ ").append(c.rating()).append("</span><span>📖 ").append(c.lessonsCount()).append(" lessons</span></div>\n");
                sb.append("      <button class='vaadin-btn primary'>Start Learning</button>\n");
                sb.append("    </article>\n");
            }
        }
        sb.append("  </div>\n");
        sb.append("</div>");
        return sb.toString();
    }
}
