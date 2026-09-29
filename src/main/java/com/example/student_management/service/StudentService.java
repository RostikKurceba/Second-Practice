package com.example.student_management.service;

import com.example.student_management.dto.StudentResponse;
import com.example.student_management.entity.Student;
import com.example.student_management.repository.StudentRepository;
import org.springframework.stereotype.Service;
import com.example.student_management.entity.StudentGroup;
import com.example.student_management.repository.StudentGroupRepository;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentGroupRepository groupRepository;

    public StudentService(
            StudentRepository studentRepository,
            StudentGroupRepository groupRepository
    ) {
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
    }

    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Студента не знайдено"
                        )
                );

        return toResponse(student);
    }

    public StudentResponse getCurrentStudent(Long userId) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Студента не знайдено"
                        )
                );

        return toResponse(student);
    }

    public List<StudentResponse> getStudentsByGroup(Long groupId) {

        return studentRepository
                .findByStudentGroupId(groupId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentResponse assignGroup(
            Long studentId,
            Long groupId
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Студента не знайдено"
                        )
                );

        StudentGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Групу не знайдено"
                        )
                );

        student.setStudentGroup(group);

        Student savedStudent =
                studentRepository.save(student);

        return toResponse(savedStudent);
    }

    private StudentResponse toResponse(Student student) {

        Long groupId = null;
        String groupName = null;
        String groupSpecialty = null;
        Integer groupCourse = null;
        Integer groupYear = null;

        java.util.List<com.example.student_management.dto.DisciplineResponse> disciplines =
                new java.util.ArrayList<>();

        if (student.getStudentGroup() != null) {

            groupId = student.getStudentGroup().getId();
            groupName = student.getStudentGroup().getName();
            groupSpecialty = student.getStudentGroup().getSpecialty();
            groupCourse = student.getStudentGroup().getCourse();
            groupYear = student.getStudentGroup().getYear();

            for (com.example.student_management.entity.Discipline discipline
                    : student.getStudentGroup().getDisciplines()) {

                disciplines.add(
                        new com.example.student_management.dto.DisciplineResponse(
                                discipline.getId(),
                                discipline.getName(),
                                discipline.getCode(),
                                discipline.getDescription(),
                                discipline.getHours()
                        )
                );
            }
        }

        return new StudentResponse(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getPatronymic(),
                student.getPhone(),
                student.getFaculty(),
                student.getCourse(),
                student.getUser().getEmail(),
                groupId,
                groupName,
                groupSpecialty,
                groupCourse,
                groupYear,
                disciplines
        );
    }
}