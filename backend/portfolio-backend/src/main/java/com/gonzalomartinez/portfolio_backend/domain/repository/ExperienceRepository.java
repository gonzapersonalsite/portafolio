package com.gonzalomartinez.portfolio_backend.domain.repository;

import com.gonzalomartinez.portfolio_backend.domain.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    List<Experience> findAllByOrderByOrderAsc();
}
