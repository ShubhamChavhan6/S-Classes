package com.sclasses.backend.service;

import com.sclasses.backend.dto.AuthResponse;
import com.sclasses.backend.dto.LoginRequest;
import com.sclasses.backend.dto.RegisterRequest;
import com.sclasses.backend.model.User;
import com.sclasses.backend.repository.UserRepository;
import com.sclasses.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? User.Role.valueOf(request.getRole()) : User.Role.STUDENT)
                .qualification(request.getQualification())
                .stream(request.getStream())
                .schoolName(request.getSchoolName())
                .studentType(request.getStudentType())
                .gradeLevel(request.getGradeLevel())
                .targetExam(request.getTargetExam())
                .languagePref("en")
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user);
    }
}
