package com.gonzalomartinez.portfolio_backend.experience.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExperienceRepositoryPort {
    List<Experience> findAllByOrderByEndDateDescStartDateDesc();
    Optional<Experience> findById(UUID id);
    Experience save(Experience experience);
    void deleteById(UUID id);
    boolean existsById(UUID id);
}
