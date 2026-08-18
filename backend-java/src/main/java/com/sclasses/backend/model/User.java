package com.sclasses.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String qualification;
    private String stream;
    private String schoolName;
    private String studentType;
    private String gradeLevel;
    private String targetExam;
    private String languagePref;

    public enum Role {
      STUDENT, INSTRUCTOR, SUPER_ADMIN
    }
}
