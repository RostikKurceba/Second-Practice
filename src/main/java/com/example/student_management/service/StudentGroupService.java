package com.example.student_management.service;

import com.example.student_management.entity.Discipline;
import com.example.student_management.entity.StudentGroup;
import com.example.student_management.repository.DisciplineRepository;
import com.example.student_management.repository.StudentGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentGroupService {

    private final StudentGroupRepository groupRepository;
    private final DisciplineRepository disciplineRepository;

    public StudentGroupService(
            StudentGroupRepository groupRepository,
            DisciplineRepository disciplineRepository
    ) {
        this.groupRepository = groupRepository;
        this.disciplineRepository = disciplineRepository;
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

        StudentGroup group =
                getGroupById(id);

        group.setName(updatedGroup.getName());
        group.setFaculty(updatedGroup.getFaculty());
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

    public List<Discipline> getGroupDisciplines(
            Long groupId
    ) {

        StudentGroup group =
                getGroupById(groupId);

        return group.getDisciplines();
    }

    public StudentGroup setGroupDisciplines(
            Long groupId,
            List<Long> disciplineIds
    ) {

        StudentGroup group =
                getGroupById(groupId);

        List<Discipline> disciplines =
                disciplineRepository.findAllById(
                        disciplineIds
                );

        if (disciplines.size() != disciplineIds.size()) {

            throw new IllegalArgumentException(
                    "Одну або декілька дисциплін не знайдено"
            );
        }

        group.setDisciplines(disciplines);

        return groupRepository.save(group);
    }
}