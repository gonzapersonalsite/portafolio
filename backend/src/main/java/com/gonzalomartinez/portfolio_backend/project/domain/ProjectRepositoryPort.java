package com.gonzalomartinez.portfolio_backend.project.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepositoryPort {
    List<Project> findAllByOrderByOrderAsc();
    List<Project> findByFeaturedTrueOrderByOrderAsc();
    Optional<Project> findById(UUID id);
    Project save(Project project);
    void deleteById(UUID id);
    boolean existsById(UUID id);
    Integer findMaxOrder();
}
