package com.example.student_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disciplines")
public class Discipline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer hours;

    @JsonIgnore
    @ManyToMany(mappedBy = "disciplines")
    private List<StudentGroup> groups = new ArrayList<>();

    public List<StudentGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<StudentGroup> groups) {
        this.groups = groups;
    }

    public Discipline() {
    }

    public Discipline(
            String name,
            String code,
            String description,
            Integer hours
    ) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.hours = hours;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public Integer getHours() {
        return hours;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }
}