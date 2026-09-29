package com.example.student_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_groups")
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 150)
    private String faculty;

    @Column(nullable = false, length = 150)
    private String specialty;

    @Column(nullable = false)
    private Integer course;

    @Column(nullable = false)
    private Integer year;

    @ManyToMany
    @JoinTable(
            name = "group_disciplines",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "discipline_id")
    )
    private List<Discipline> disciplines = new ArrayList<>();

    public StudentGroup() {
    }

    public StudentGroup(
            String name,
            String faculty,
            String specialty,
            Integer course,
            Integer year
    ) {
        this.name = name;
        this.faculty = faculty;
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

    public String getFaculty() {
        return faculty;
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

    public List<Discipline> getDisciplines() {
        return disciplines;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
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

    public void setDisciplines(List<Discipline> disciplines) {
        this.disciplines = disciplines;
    }
}