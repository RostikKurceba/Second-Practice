package com.example.student_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(length = 50)
    private String patronymic;

    @Column(length = 30)
    private String phone;

    @Column(nullable = false, length = 150)
    private String faculty;

    @Column(nullable = false)
    private Integer course;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private StudentGroup studentGroup;

    public Student() {
    }

    public Student(
            String firstName,
            String lastName,
            String patronymic,
            String phone,
            String faculty,
            Integer course,
            User user
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymic = patronymic;
        this.phone = phone;
        this.faculty = faculty;
        this.course = course;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public String getPhone() {
        return phone;
    }

    public String getFaculty() {
        return faculty;
    }

    public Integer getCourse() {
        return course;
    }

    public User getUser() {
        return user;
    }

    public StudentGroup getStudentGroup() {
        return studentGroup;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public void setCourse(Integer course) {
        this.course = course;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStudentGroup(StudentGroup studentGroup) {
        this.studentGroup = studentGroup;
    }
}