package com.gonzalomartinez.portfolio_backend.skill.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SkillRepositoryPort {
    List<Skill> findAllByOrderByOrderAsc();
    List<Skill> findAll();
    Optional<Skill> findById(UUID id);
    Skill save(Skill skill);
    void deleteById(UUID id);
    boolean existsById(UUID id);
}
