package com.sclasses.enterprise;

import java.util.*;

/**
 * Enterprise Spring Boot 3 Layered Architecture Simulation in Java:
 * 1. Model / DTO Records (Data Transfer Objects)
 * 2. Repository Layer (Data Persistence)
 * 3. Service Layer (Business Logic & Transactions)
 * 4. Controller Layer (REST API Endpoints Simulation)
 */
public class SpringBootSimulation {

    // 1. DTO Record
    public record CourseDTO(String id, String title, String category, double price, int durationHours) {}
    public record ApiResponse<T>(int statusCode, String message, T data) {}

    // 2. Repository Interface & In-Memory Implementation
    public interface CourseRepository {
        List<CourseDTO> findAll();
        Optional<CourseDTO> findById(String id);
        CourseDTO save(CourseDTO course);
    }

    public static class CourseRepositoryImpl implements CourseRepository {
        private final Map<String, CourseDTO> database = new HashMap<>();

        @Override
        public List<CourseDTO> findAll() {
            return new ArrayList<>(database.values());
        }

        @Override
        public Optional<CourseDTO> findById(String id) {
            return Optional.ofNullable(database.get(id));
        }

        @Override
        public CourseDTO save(CourseDTO course) {
            database.put(course.id(), course);
            return course;
        }
    }

    // 3. Service Layer
    public static class CourseService {
        private final CourseRepository repository;

        public CourseService(CourseRepository repository) {
            this.repository = repository;
        }

        public CourseDTO createCourse(CourseDTO dto) {
            if (dto.price() < 0) throw new IllegalArgumentException("Course price cannot be negative");
            return repository.save(dto);
        }

        public List<CourseDTO> getAllCourses() {
            return repository.findAll();
        }
    }

    // 4. REST Controller Simulation
    public static class CourseRestController {
        private final CourseService service;

        public CourseRestController(CourseService service) {
            this.service = service;
        }

        public ApiResponse<List<CourseDTO>> getCourses() {
            List<CourseDTO> list = service.getAllCourses();
            return new ApiResponse<>(200, "Fetched " + list.size() + " courses", list);
        }

        public ApiResponse<CourseDTO> postCourse(CourseDTO course) {
            CourseDTO saved = service.createCourse(course);
            return new ApiResponse<>(201, "Course created successfully", saved);
        }
    }

    public static void runDemo() {
        System.out.println("--- 1. Spring Boot 3 REST API Simulation ---");
        CourseRepository repo = new CourseRepositoryImpl();
        CourseService service = new CourseService(repo);
        CourseRestController controller = new CourseRestController(service);

        // Simulate POST requests
        controller.postCourse(new CourseDTO("JAVA-101", "Mastering Java 21 LTS", "PROGRAMMING", 0.0, 40));
        controller.postCourse(new CourseDTO("SPRING-202", "Spring Boot 3 Microservices", "BACKEND", 0.0, 35));

        // Simulate GET request
        ApiResponse<List<CourseDTO>> response = controller.getCourses();
        System.out.println("  HTTP Status: " + response.statusCode() + " | Message: " + response.message());
        for (CourseDTO c : response.data()) {
            System.out.printf("  • [%s] %-30s | Category: %s | Hours: %d%n",
                c.id(), c.title(), c.category(), c.durationHours());
        }
    }
}
