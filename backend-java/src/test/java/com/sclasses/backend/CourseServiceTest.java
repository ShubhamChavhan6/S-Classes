package com.sclasses.backend;

import com.sclasses.backend.service.CourseService;
import com.sclasses.backend.model.Course;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.sclasses.backend.repository.CourseRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Course Service Unit Tests (Pure Java JUnit 5)")
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Should retrieve all courses successfully")
    void testGetAllCourses() {
        Course c1 = new Course();
        c1.setId("c1");
        c1.setTitle("Class 10 CBSE Science");
        c1.setQualificationCategory("SECONDARY");

        when(courseRepository.findAll()).thenReturn(List.of(c1));

        List<Course> results = courseService.getAllCourses();
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Class 10 CBSE Science", results.get(0).getTitle());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should filter courses by recommended qualification category")
    void testGetRecommendedCourses() {
        Course c1 = new Course();
        c1.setId("c2");
        c1.setTitle("ICSE Class 10 Java Computer Applications");
        c1.setQualificationCategory("SECONDARY");

        when(courseRepository.findByQualificationCategory("SECONDARY")).thenReturn(List.of(c1));

        List<Course> results = courseService.getRecommendedCourses("Class 9 - 10 (Secondary)", "Science");
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("SECONDARY", results.get(0).getQualificationCategory());
    }

    @Test
    @DisplayName("Should find course by ID")
    void testGetCourseById() {
        Course c1 = new Course();
        c1.setId("c-100");
        c1.setTitle("Advanced Algorithms");

        when(courseRepository.findById("c-100")).thenReturn(Optional.of(c1));

        Optional<Course> result = courseService.getCourseById("c-100");
        assertTrue(result.isPresent());
        assertEquals("Advanced Algorithms", result.get().getTitle());
    }
}
