package com.example.student_management.controller;

import com.example.student_management.entity.StudentGroup;
import com.example.student_management.service.StudentGroupService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class StudentGroupController {

    private final StudentGroupService groupService;

    public StudentGroupController(
            StudentGroupService groupService
    ) {
        this.groupService = groupService;
    }

    private boolean isAdmin(HttpSession session) {

        String role =
                (String) session.getAttribute("userRole");

        return "ADMIN".equals(role);
    }

    @GetMapping
    public ResponseEntity<?> getAllGroups(
            HttpSession session
    ) {

        if (!isAdmin(session)) {

            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        return ResponseEntity.ok(
                groupService.getAllGroups()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroup(
            @PathVariable Long id,
            HttpSession session
    ) {

        if (!isAdmin(session)) {

            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    groupService.getGroupById(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestBody StudentGroup group,
            HttpSession session
    ) {

        if (!isAdmin(session)) {

            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    groupService.createGroup(group)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(
            @PathVariable Long id,
            @RequestBody StudentGroup group,
            HttpSession session
    ) {

        if (!isAdmin(session)) {

            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            return ResponseEntity.ok(
                    groupService.updateGroup(
                            id,
                            group
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(
            @PathVariable Long id,
            HttpSession session
    ) {

        if (!isAdmin(session)) {

            return ResponseEntity.status(403)
                    .body("Доступ заборонено");
        }

        try {

            groupService.deleteGroup(id);

            return ResponseEntity.ok(
                    "Групу успішно видалено"
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}