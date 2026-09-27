package com.example.student_management.service;

import com.example.student_management.entity.Discipline;
import com.example.student_management.repository.DisciplineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;

    public DisciplineService(
            DisciplineRepository disciplineRepository
    ) {
        this.disciplineRepository = disciplineRepository;
    }

    public List<Discipline> getAllDisciplines() {
        return disciplineRepository.findAll();
    }

    public Discipline getDisciplineById(Long id) {

        return disciplineRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Дисципліну не знайдено"
                        )
                );
    }

    public Discipline createDiscipline(
            Discipline discipline
    ) {

        if (disciplineRepository.existsByCode(
                discipline.getCode()
        )) {
            throw new IllegalArgumentException(
                    "Дисципліна з таким кодом вже існує"
            );
        }

        return disciplineRepository.save(discipline);
    }

    public Discipline updateDiscipline(
            Long id,
            Discipline updatedDiscipline
    ) {

        Discipline discipline =
                getDisciplineById(id);

        discipline.setName(
                updatedDiscipline.getName()
        );

        discipline.setCode(
                updatedDiscipline.getCode()
        );

        discipline.setDescription(
                updatedDiscipline.getDescription()
        );

        discipline.setHours(
                updatedDiscipline.getHours()
        );

        return disciplineRepository.save(discipline);
    }

    public void deleteDiscipline(Long id) {

        if (!disciplineRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Дисципліну не знайдено"
            );
        }

        disciplineRepository.deleteById(id);
    }
}