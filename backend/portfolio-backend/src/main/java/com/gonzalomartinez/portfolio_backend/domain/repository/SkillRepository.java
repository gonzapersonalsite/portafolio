package com.gonzalomartinez.portfolio_backend.domain.repository;

import com.gonzalomartinez.portfolio_backend.domain.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    List<Skill> findAllByOrderByOrderAsc();
}
