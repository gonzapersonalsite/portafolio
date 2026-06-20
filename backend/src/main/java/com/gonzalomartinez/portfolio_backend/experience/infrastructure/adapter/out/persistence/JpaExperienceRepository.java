package com.gonzalomartinez.portfolio_backend.experience.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaExperienceRepository extends JpaRepository<ExperienceEntity, UUID> {
    @EntityGraph(attributePaths = {"technologies"})
    @Query("SELECT e FROM ExperienceEntity e ORDER BY e.endDate DESC NULLS FIRST, e.startDate DESC")
    List<ExperienceEntity> findAllByOrderByEndDateDescStartDateDesc();

    @EntityGraph(attributePaths = {"technologies"})
    Optional<ExperienceEntity> findById(UUID id);
}
