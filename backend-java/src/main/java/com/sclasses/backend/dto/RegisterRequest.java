package com.sclasses.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String qualification;
    private String stream;
    private String schoolName;
    private String studentType;
    private String gradeLevel;
    private String targetExam;
}
