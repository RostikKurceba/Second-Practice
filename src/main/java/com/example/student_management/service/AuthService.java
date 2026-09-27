package com.example.student_management.service;

import com.example.student_management.dto.LoginRequest;
import com.example.student_management.dto.RegisterRequest;
import com.example.student_management.entity.Role;
import com.example.student_management.entity.User;
import com.example.student_management.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Користувач з таким email вже існує"
            );
        }

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Паролі не співпадають"
            );
        }

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User(
                email,
                encodedPassword,
                request.getRole()
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Неправильний email або пароль"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "Неправильний email або пароль"
            );
        }

        return user;
    }
}