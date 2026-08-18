package com.sclasses.backend.controller;

import com.sclasses.backend.model.User;
import com.sclasses.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        // Mock current user lookup or decode token
        return userService.getUserById("user-1")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody User profileData) {
        return ResponseEntity.ok(userService.updateProfile("user-1", profileData));
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "recentProgress", 75,
            "completedLessons", 14,
            "aiStudyStreak", 5,
            "nextMilestone", "Chapter 4 Board Revision"
        ));
    }
}
