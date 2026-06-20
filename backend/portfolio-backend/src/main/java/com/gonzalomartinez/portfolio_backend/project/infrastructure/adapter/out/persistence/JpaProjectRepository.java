package com.gonzalomartinez.portfolio_backend.project.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findAllByOrderByOrderAsc();
    List<ProjectEntity> findByFeaturedTrueOrderByOrderAsc();

    @Query("SELECT MAX(p.order) FROM ProjectEntity p")
    Integer findMaxOrder();
}
