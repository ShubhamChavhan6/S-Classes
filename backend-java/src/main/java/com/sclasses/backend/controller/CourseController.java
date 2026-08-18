package com.sclasses.backend.controller;

import com.sclasses.backend.model.Course;
import com.sclasses.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getRecommendations(
            @RequestParam(required = false, defaultValue = "Senior Secondary") String qualification,
            @RequestParam(required = false, defaultValue = "") String stream) {

        List<Course> courses = courseService.getRecommendedCourses(qualification, stream);
        return ResponseEntity.ok(Map.of(
            "qualification", qualification,
            "stream", stream,
            "courses", courses
        ));
    }
}
