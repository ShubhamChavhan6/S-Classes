package com.sclasses.backend.repository;

import com.sclasses.backend.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByQualificationCategory(String qualificationCategory);
    List<Course> findBySubjectContainingIgnoreCase(String subject);
}
