package com.sclasses.backend.service;

import com.sclasses.backend.model.Course;
import com.sclasses.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public List<Course> getRecommendedCourses(String qualification, String stream) {
        String category = mapQualificationToCategory(qualification);
        return courseRepository.findByQualificationCategory(category);
    }

    private String mapQualificationToCategory(String qualification) {
        if (qualification == null) return "SECONDARY";
        String lower = qualification.toLowerCase();

        if (lower.contains("class 1 - 5") || lower.contains("kids") || lower.contains("primary")) {
            return "KIDS";
        } else if (lower.contains("class 6 - 8") || lower.contains("middle")) {
            return "MIDDLE";
        } else if (lower.contains("class 9 - 10") || lower.contains("secondary") || lower.contains("matric")) {
            return "SECONDARY";
        } else if (lower.contains("class 11 - 12") || lower.contains("senior secondary") || lower.contains("higher secondary") || lower.contains("intermediate")) {
            return "SENIOR_SECONDARY";
        } else if (lower.contains("undergraduate") || lower.contains("college") || lower.contains("b.tech") || lower.contains("b.sc")) {
            return "HIGHER_EDU";
        }
        return "SECONDARY";
    }
}
