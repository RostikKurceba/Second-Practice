package com.example.student_management.dto;

import com.example.student_management.entity.Role;

public class AuthResponse {

    private Long id;
    private String email;
    private Role role;
    private String message;

    public AuthResponse(
            Long id,
            String email,
            Role role,
            String message
    ) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}