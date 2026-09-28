package com.example.student_management.controller;

import com.example.student_management.service.StudentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllStudents(
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity
                    .status(403)
                    .body("Доступ заборонено");
        }

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(
            @PathVariable Long id,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity
                    .status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    studentService.getStudentById(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    private boolean isAdmin(HttpSession session) {

        Object role =
                session.getAttribute("userRole");

        return role != null &&
                role.toString().equals("ADMIN");
    }

    @PutMapping("/{studentId}/group/{groupId}")
    public ResponseEntity<?> assignGroup(
            @PathVariable Long studentId,
            @PathVariable Long groupId,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity
                    .status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    studentService.assignGroup(
                            studentId,
                            groupId
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}