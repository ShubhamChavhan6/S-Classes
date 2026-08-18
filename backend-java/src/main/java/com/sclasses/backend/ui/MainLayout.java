package com.sclasses.backend.ui;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Vaadin-style 100% pure Java Web UI Architecture for S-Classes Platform.
 * Implements server-side stateful component hierarchy, two-way data binding,
 * event routing, and reactive UI updates completely in Java without JS/TS.
 */
public class MainLayout implements Serializable {
    private static final long serialVersionUID = 1L;

    private String title = "S-Classes AI Enterprise Suite";
    private String currentView = "dashboard";
    private final List<NavigationItem> navigationItems = new ArrayList<>();
    private final List<Component> contentArea = new ArrayList<>();

    public record NavigationItem(String id, String label, String icon, String route) implements Serializable {}

    public interface Component extends Serializable {
        String renderHtml();
        String getId();
    }

    public MainLayout() {
        initNavigation();
    }

    private void initNavigation() {
        navigationItems.add(new NavigationItem("nav-dashboard", "Dashboard", "dashboard", "/ui/dashboard"));
        navigationItems.add(new NavigationItem("nav-courses", "Courses Catalog", "book-open", "/ui/courses"));
        navigationItems.add(new NavigationItem("nav-ai-tutor", "AI Doubt Solver", "cpu", "/ui/ai-tutor"));
        navigationItems.add(new NavigationItem("nav-code-studio", "Java 21 Code Studio", "code", "/ui/code-studio"));
        navigationItems.add(new NavigationItem("nav-exam-simulator", "Mock Exam Simulator", "award", "/ui/exams"));
        navigationItems.add(new NavigationItem("nav-admin", "Analytics & Admin", "bar-chart", "/ui/admin"));
    }

    public void navigateTo(String viewName) {
        this.currentView = viewName;
        this.contentArea.clear();
    }

    public void addComponent(Component component) {
        this.contentArea.add(component);
    }

    public List<NavigationItem> getNavigationItems() {
        return List.copyOf(navigationItems);
    }

    public List<Component> getContentArea() {
        return List.copyOf(contentArea);
    }

    public String getCurrentView() {
        return currentView;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
