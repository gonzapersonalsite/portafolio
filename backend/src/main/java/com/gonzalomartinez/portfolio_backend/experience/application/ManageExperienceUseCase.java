package com.gonzalomartinez.portfolio_backend.experience.application;

import java.util.List;
import java.util.UUID;

public interface ManageExperienceUseCase {
    List<ExperienceDto> getAllExperiences();
    ExperienceDto getExperienceById(UUID id);
    ExperienceDto createExperience(ExperienceDto dto);
    ExperienceDto updateExperience(UUID id, ExperienceDto dto);
    void deleteExperience(UUID id);
}
