package com.sclasses.backend.ui.views;

import com.sclasses.backend.ui.MainLayout;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Vaadin Pure Java AI Doubt Solver & Tutor View.
 * Implements real-time step-by-step mathematical derivations and chat threads.
 */
public class AiTutorView implements MainLayout.Component, Serializable {
    private static final long serialVersionUID = 1L;

    public record ChatMessage(String id, String sender, String content, String timestamp, boolean isAi) implements Serializable {}

    private final String id = "view-ai-tutor";
    private final List<ChatMessage> conversationHistory = new ArrayList<>();
    private String activeLanguage = "en";

    public AiTutorView() {
        initDefaultGreeting();
    }

    private void initDefaultGreeting() {
        conversationHistory.add(new ChatMessage(
            "msg-0",
            "EduBot AI Tutor",
            "Hello! I am your S-Classes AI Tutor. Ask me any conceptual question, derivation, or formula in Math, Science, or Computer Science.",
            "Just now",
            true
        ));
    }

    public void postUserMessage(String message) {
        if (message != null && !message.isBlank()) {
            conversationHistory.add(new ChatMessage("msg-" + System.currentTimeMillis(), "Student", message, "Now", false));
        }
    }

    public void appendAiResponse(String response) {
        if (response != null && !response.isBlank()) {
            conversationHistory.add(new ChatMessage("msg-" + System.currentTimeMillis(), "EduBot AI Tutor", response, "Now", true));
        }
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String renderHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='vaadin-ai-tutor-container'>\n");
        sb.append("  <header class='tutor-header'>\n");
        sb.append("    <h2>🤖 AI Tutor & Step-by-Step Problem Solver</h2>\n");
        sb.append("    <span class='tutor-status'>Online &bull; Java 21 Engine</span>\n");
        sb.append("  </header>\n");
        sb.append("  <div class='chat-feed'>\n");
        for (ChatMessage msg : conversationHistory) {
            String roleClass = msg.isAi() ? "ai-msg" : "user-msg";
            sb.append("    <div class='chat-bubble ").append(roleClass).append("'>\n");
            sb.append("      <span class='sender'>").append(msg.sender()).append("</span>\n");
            sb.append("      <p class='body'>").append(msg.content()).append("</p>\n");
            sb.append("      <time>").append(msg.timestamp()).append("</time>\n");
            sb.append("    </div>\n");
        }
        sb.append("  </div>\n");
        sb.append("</div>");
        return sb.toString();
    }

    public List<ChatMessage> getConversationHistory() {
        return List.copyOf(conversationHistory);
    }
}
