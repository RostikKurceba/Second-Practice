package com.example.student_management.dto;

import com.example.student_management.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email не може бути порожнім")
    @Email(message = "Некоректний email")
    private String email;

    @NotBlank(message = "Пароль не може бути порожнім")
    @Size(min = 6, message = "Пароль повинен містити щонайменше 6 символів")
    private String password;

    @NotBlank(message = "Підтвердження пароля не може бути порожнім")
    private String confirmPassword;

    @NotNull(message = "Необхідно вибрати роль")
    private Role role;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public Role getRole() {
        return role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}