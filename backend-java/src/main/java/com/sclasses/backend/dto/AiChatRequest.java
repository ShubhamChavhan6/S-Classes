package com.sclasses.backend.dto;

import lombok.Data;

@Data
public class AiChatRequest {
    private String prompt;
    private String sessionId;
    private String studentContext;
}
