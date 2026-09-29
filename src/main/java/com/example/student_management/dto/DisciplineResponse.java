package com.example.student_management.dto;

public class DisciplineResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer hours;

    public DisciplineResponse() {
    }

    public DisciplineResponse(
            Long id,
            String name,
            String code,
            String description,
            Integer hours
    ) {
        this.id = id;
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
}