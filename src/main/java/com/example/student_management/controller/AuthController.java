package com.example.student_management.controller;

import com.example.student_management.dto.AuthResponse;
import com.example.student_management.dto.LoginRequest;
import com.example.student_management.dto.RegisterRequest;
import com.example.student_management.entity.User;
import com.example.student_management.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        try {

            User user = authService.register(request);

            return ResponseEntity.ok(
                    new AuthResponse(
                            user.getId(),
                            user.getEmail(),
                            user.getRole(),
                            "Реєстрація успішна"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session
    ) {

        try {

            User user = authService.login(request);

            session.setAttribute(
                    "userId",
                    user.getId()
            );

            session.setAttribute(
                    "userEmail",
                    user.getEmail()
            );

            session.setAttribute(
                    "userRole",
                    user.getRole().name()
            );

            return ResponseEntity.ok(
                    new AuthResponse(
                            user.getId(),
                            user.getEmail(),
                            user.getRole(),
                            "Вхід успішний"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(401)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpSession session
    ) {

        session.invalidate();

        return ResponseEntity.ok(
                "Ви успішно вийшли з системи"
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(
            HttpSession session
    ) {

        Long userId =
                (Long) session.getAttribute("userId");

        String email =
                (String) session.getAttribute("userEmail");

        String role =
                (String) session.getAttribute("userRole");

        if (userId == null) {

            return ResponseEntity.status(401)
                    .body("Користувач не авторизований");
        }

        return ResponseEntity.ok(
                new AuthResponse(
                        userId,
                        email,
                        com.example.student_management.entity.Role.valueOf(role),
                        "Користувач авторизований"
                )
        );
    }
}