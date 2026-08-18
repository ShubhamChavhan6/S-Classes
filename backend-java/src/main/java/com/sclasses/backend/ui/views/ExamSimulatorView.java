package com.sclasses.backend.ui.views;

import com.sclasses.backend.ui.MainLayout;
import java.io.Serializable;
import java.util.List;

/**
 * Vaadin Pure Java Exam Simulator View.
 * Handles timed mock exams, live answer evaluation, and instant grade scorecards.
 */
public class ExamSimulatorView implements MainLayout.Component, Serializable {
    private static final long serialVersionUID = 1L;

    public record Question(String id, String prompt, List<String> options, int correctIndex, String explanation) implements Serializable {}

    private final String id = "view-exam-simulator";
    private final String examTitle;
    private final int timeRemainingSeconds;
    private final List<Question> questions;
    private int currentQuestionIndex = 0;

    public ExamSimulatorView(String examTitle, int timeRemainingSeconds, List<Question> questions) {
        this.examTitle = examTitle;
        this.timeRemainingSeconds = timeRemainingSeconds;
        this.questions = questions != null ? List.copyOf(questions) : List.of();
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String renderHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='vaadin-exam-container'>\n");
        sb.append("  <header class='exam-header'>\n");
        sb.append("    <h2>📝 ").append(examTitle).append("</h2>\n");
        sb.append("    <div class='timer-pill'>⏱ Time: ").append(timeRemainingSeconds / 60).append("m ").append(timeRemainingSeconds % 60).append("s</div>\n");
        sb.append("  </header>\n");
        if (!questions.isEmpty() && currentQuestionIndex < questions.size()) {
            Question q = questions.get(currentQuestionIndex);
            sb.append("  <div class='question-card'>\n");
            sb.append("    <span class='q-num'>Question ").append(currentQuestionIndex + 1).append(" of ").append(questions.size()).append("</span>\n");
            sb.append("    <p class='q-prompt'>").append(q.prompt()).append("</p>\n");
            sb.append("    <div class='options-group'>\n");
            for (int i = 0; i < q.options().size(); i++) {
                sb.append("      <button class='option-btn'><b>").append((char)('A' + i)).append(".</b> ").append(q.options().get(i)).append("</button>\n");
            }
            sb.append("    </div>\n");
            sb.append("  </div>\n");
        }
        sb.append("</div>");
        return sb.toString();
    }
}
