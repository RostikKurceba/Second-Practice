package com.example.student_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_groups")
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 150)
    private String specialty;

    @Column(nullable = false)
    private Integer course;

    @Column(nullable = false)
    private Integer year;

    public StudentGroup() {
    }

    public StudentGroup(
            String name,
            String specialty,
            Integer course,
            Integer year
    ) {
        this.name = name;
        this.specialty = specialty;
        this.course = course;
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public Integer getCourse() {
        return course;
    }

    public Integer getYear() {
        return year;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public void setCourse(Integer course) {
        this.course = course;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}