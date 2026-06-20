package com.gonzalomartinez.portfolio_backend.project.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JpaProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    @EntityGraph(attributePaths = {"technologies", "imageUrls"})
    List<ProjectEntity> findAllByOrderByOrderAsc();

    @EntityGraph(attributePaths = {"technologies", "imageUrls"})
    List<ProjectEntity> findByFeaturedTrueOrderByOrderAsc();

    @EntityGraph(attributePaths = {"technologies", "imageUrls"})
    Optional<ProjectEntity> findById(UUID id);

    @Query("SELECT MAX(p.order) FROM ProjectEntity p")
    Integer findMaxOrder();
}
