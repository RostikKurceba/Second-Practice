package com.example.student_management.repository;

import com.example.student_management.entity.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentGroupRepository
        extends JpaRepository<StudentGroup, Long> {

    boolean existsByName(String name);
}