package com.example.student_management.service;

import com.example.student_management.entity.StudentGroup;
import com.example.student_management.repository.StudentGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentGroupService {

    private final StudentGroupRepository groupRepository;

    public StudentGroupService(
            StudentGroupRepository groupRepository
    ) {
        this.groupRepository = groupRepository;
    }

    public List<StudentGroup> getAllGroups() {

        return groupRepository.findAll();
    }

    public StudentGroup getGroupById(Long id) {

        return groupRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Групу не знайдено"
                        )
                );
    }

    public StudentGroup createGroup(
            StudentGroup group
    ) {

        if (groupRepository.existsByName(group.getName())) {

            throw new IllegalArgumentException(
                    "Група з такою назвою вже існує"
            );
        }

        return groupRepository.save(group);
    }

    public StudentGroup updateGroup(
            Long id,
            StudentGroup updatedGroup
    ) {

        StudentGroup group = getGroupById(id);

        group.setName(updatedGroup.getName());
        group.setSpecialty(updatedGroup.getSpecialty());
        group.setCourse(updatedGroup.getCourse());
        group.setYear(updatedGroup.getYear());

        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {

        if (!groupRepository.existsById(id)) {

            throw new IllegalArgumentException(
                    "Групу не знайдено"
            );
        }

        groupRepository.deleteById(id);
    }
}