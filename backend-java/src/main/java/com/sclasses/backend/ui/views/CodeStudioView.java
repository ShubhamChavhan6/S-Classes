package com.sclasses.backend.ui.views;

import com.sclasses.backend.ui.MainLayout;
import java.io.Serializable;

/**
 * Vaadin Pure Java Cloud Code Studio & JVM Sandboxed Runner View.
 * Provides live code editor binding, compilation metrics, standard IO output, and memory charts.
 */
public class CodeStudioView implements MainLayout.Component, Serializable {
    private static final long serialVersionUID = 1L;

    private final String id = "view-code-studio";
    private String sourceCode = """
        // Modern Java 21 LTS Code Studio
        import java.util.*;

        public class Main {
            public static void main(String[] args) {
                System.out.println("=== Welcome to S-Classes Java 21 Code Studio ===");
                List<String> tracks = List.of("ICSE Board", "CBSE Board", "JEE/NEET", "DSA", "Spring Boot");
                tracks.forEach(t -> System.out.println("🚀 Mastering Track: " + t));
            }
        }
        """;
    private String executionOutput = "Ready to compile & execute with OpenJDK 21 LTS.";
    private String compilerStatus = "IDLE";
    private int executionTimeMs = 0;
    private double memoryUsedMb = 0.0;

    @Override
    public String getId() {
        return id;
    }

    public void setSourceCode(String code) {
        if (code != null) this.sourceCode = code;
    }

    public void recordExecutionResult(String output, int timeMs, double memoryMb) {
        this.executionOutput = output;
        this.executionTimeMs = timeMs;
        this.memoryUsedMb = memoryMb;
        this.compilerStatus = "SUCCESS";
    }

    @Override
    public String renderHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class='vaadin-code-studio'>\n");
        sb.append("  <div class='editor-pane'>\n");
        sb.append("    <div class='editor-toolbar'><span class='tag'>Java 21 JDK</span><button class='vaadin-btn run-btn'>▶ Compile & Run</button></div>\n");
        sb.append("    <pre class='code-area'><code>").append(escapeHtml(sourceCode)).append("</code></pre>\n");
        sb.append("  </div>\n");
        sb.append("  <div class='console-pane'>\n");
        sb.append("    <div class='console-header'><span>Console Output (Exit Code: 0)</span><span>").append(executionTimeMs).append(" ms | ").append(memoryUsedMb).append(" MB</span></div>\n");
        sb.append("    <pre class='console-output'>").append(escapeHtml(executionOutput)).append("</pre>\n");
        sb.append("  </div>\n");
        sb.append("</div>");
        return sb.toString();
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    public String getSourceCode() { return sourceCode; }
    public String getExecutionOutput() { return executionOutput; }
}
