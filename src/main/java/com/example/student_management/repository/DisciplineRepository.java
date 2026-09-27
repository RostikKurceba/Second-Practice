package com.example.student_management.repository;

import com.example.student_management.entity.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplineRepository
        extends JpaRepository<Discipline, Long> {

    boolean existsByCode(String code);
}