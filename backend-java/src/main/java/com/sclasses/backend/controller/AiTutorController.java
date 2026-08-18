package com.sclasses.backend.controller;

import com.sclasses.backend.dto.AiChatRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiTutorController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chatWithAiTutor(@RequestBody AiChatRequest request) {
        String answer = "Hello! As your AI S-Classes Tutor, I'm here to help you master " +
                (request.getPrompt() != null ? request.getPrompt() : "your subjects") +
                " step by step with clear analogies and interactive examples!";

        return ResponseEntity.ok(Map.of(
            "sessionId", request.getSessionId() != null ? request.getSessionId() : "session-1",
            "reply", answer,
            "status", "success"
        ));
    }
}
