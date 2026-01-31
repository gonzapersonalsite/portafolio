package com.gonzalomartinez.portfolio_backend.domain.repository;

import com.gonzalomartinez.portfolio_backend.domain.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findAllByOrderByOrderAsc();
    List<Project> findByFeaturedTrueOrderByOrderAsc();
}
