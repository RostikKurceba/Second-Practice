package com.example.student_management.dto;

public class StudentResponse {

    private Long id;

    private String firstName;
    private String lastName;
    private String patronymic;
    private String phone;

    private String faculty;
    private Integer course;

    private String email;

    private Long groupId;
    private String groupName;

    public StudentResponse() {
    }

    public StudentResponse(
            Long id,
            String firstName,
            String lastName,
            String patronymic,
            String phone,
            String faculty,
            Integer course,
            String email,
            Long groupId,
            String groupName
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymic = patronymic;
        this.phone = phone;
        this.faculty = faculty;
        this.course = course;
        this.email = email;
        this.groupId = groupId;
        this.groupName = groupName;
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

    public String getEmail() {
        return email;
    }

    public Long getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }
}