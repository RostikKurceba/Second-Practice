package com.example.student_management.controller;

import com.example.student_management.entity.Discipline;
import com.example.student_management.service.DisciplineService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disciplines")
public class DisciplineController {

    private final DisciplineService disciplineService;

    public DisciplineController(
            DisciplineService disciplineService
    ) {
        this.disciplineService = disciplineService;
    }

    private boolean isAdmin(HttpSession session) {

        String role =
                (String) session.getAttribute("userRole");

        return "ADMIN".equals(role);
    }

    @GetMapping
    public ResponseEntity<?> getAllDisciplines(
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        return ResponseEntity.ok(
                disciplineService.getAllDisciplines()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiscipline(
            @PathVariable Long id,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    disciplineService
                            .getDisciplineById(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createDiscipline(
            @RequestBody Discipline discipline,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    disciplineService
                            .createDiscipline(discipline)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscipline(
            @PathVariable Long id,
            @RequestBody Discipline discipline,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    disciplineService
                            .updateDiscipline(
                                    id,
                                    discipline
                            )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscipline(
            @PathVariable Long id,
            HttpSession session
    ) {

        if (!isAdmin(session)) {
            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            disciplineService
                    .deleteDiscipline(id);

            return ResponseEntity.ok(
                    "Дисципліну успішно видалено"
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}