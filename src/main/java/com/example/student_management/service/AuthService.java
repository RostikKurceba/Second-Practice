package com.example.student_management.service;

import com.example.student_management.dto.LoginRequest;
import com.example.student_management.dto.RegisterRequest;
import com.example.student_management.entity.Role;
import com.example.student_management.entity.Student;
import com.example.student_management.entity.User;
import com.example.student_management.repository.StudentRepository;
import com.example.student_management.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            StudentRepository studentRepository
    ) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
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

        if (request.getRole() == Role.STUDENT) {

            if (request.getFirstName() == null ||
                    request.getFirstName().isBlank()) {

                throw new IllegalArgumentException(
                        "Вкажіть ім'я"
                );
            }

            if (request.getLastName() == null ||
                    request.getLastName().isBlank()) {

                throw new IllegalArgumentException(
                        "Вкажіть прізвище"
                );
            }

            if (request.getFaculty() == null ||
                    request.getFaculty().isBlank()) {

                throw new IllegalArgumentException(
                        "Вкажіть факультет"
                );
            }

            if (request.getCourse() == null ||
                    request.getCourse() < 1 ||
                    request.getCourse() > 6) {

                throw new IllegalArgumentException(
                        "Вкажіть правильний курс"
                );
            }
        }

        String encodedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        User user = new User(
                email,
                encodedPassword,
                request.getRole()
        );

        User savedUser =
                userRepository.save(user);

        if (request.getRole() == Role.STUDENT) {

            Student student = new Student(
                    request.getFirstName().trim(),
                    request.getLastName().trim(),
                    request.getPatronymic() != null
                            ? request.getPatronymic().trim()
                            : null,
                    request.getPhone() != null
                            ? request.getPhone().trim()
                            : null,
                    request.getFaculty().trim(),
                    request.getCourse(),
                    savedUser
            );

            studentRepository.save(student);
        }

        return savedUser;
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