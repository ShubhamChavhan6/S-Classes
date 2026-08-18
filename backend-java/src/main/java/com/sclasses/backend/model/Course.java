package com.sclasses.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String mode;
    private String level;
    private String qualificationCategory;
    private String subject;
    private String instructorName;
    private Double avgRating;
    private Integer totalStudents;
    private Integer totalLessons;

    @Column(length = 2000)
    private String description;

    private String videoId;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "course")
    private List<Lesson> lessons;
}
