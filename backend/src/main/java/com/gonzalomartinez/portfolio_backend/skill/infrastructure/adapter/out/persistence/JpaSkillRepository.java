package com.gonzalomartinez.portfolio_backend.skill.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaSkillRepository extends JpaRepository<SkillEntity, UUID> {
    List<SkillEntity> findAllByOrderByOrderAsc();

    @Query("SELECT MAX(s.order) FROM SkillEntity s")
    Integer findMaxOrder();
}
