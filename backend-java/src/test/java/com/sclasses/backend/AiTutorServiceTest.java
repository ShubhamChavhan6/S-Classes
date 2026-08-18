package com.sclasses.backend;

import com.sclasses.backend.service.AiTutorReasoningEngine;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AI Tutor Reasoning Engine Unit Tests (JUnit 5)")
class AiTutorServiceTest {

    private final AiTutorReasoningEngine reasoningEngine = new AiTutorReasoningEngine();

    @Test
    @DisplayName("Should accurately derive photosynthesis bioenergetics")
    void testPhotosynthesisDerivation() {
        var result = reasoningEngine.solveQuery("Explain photosynthesis light and dark reactions", "en");
        assertNotNull(result);
        assertTrue(result.concept().toLowerCase().contains("photosynthesis"));
        assertFalse(result.steps().isEmpty());
        assertTrue(result.steps().size() >= 3);
        assertEquals(1, result.steps().get(0).stepNumber());
    }

    @Test
    @DisplayName("Should handle calculus integration query with step-by-step breakdown")
    void testCalculusQuery() {
        var result = reasoningEngine.solveQuery("How to solve calculus integration definite integral?", "en");
        assertNotNull(result);
        assertNotNull(result.summary());
        assertFalse(result.steps().isEmpty());
    }

    @Test
    @DisplayName("Should dynamically construct reasoning steps for open-ended queries")
    void testDynamicSynthesis() {
        var result = reasoningEngine.solveQuery("Newton Third Law of Motion in rocket propulsion", "hi");
        assertNotNull(result);
        assertNotNull(result.pedagogicalTip());
        assertEquals(3, result.steps().size());
    }
}
