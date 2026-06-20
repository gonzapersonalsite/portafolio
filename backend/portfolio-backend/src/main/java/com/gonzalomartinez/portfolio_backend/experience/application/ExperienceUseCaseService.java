package com.gonzalomartinez.portfolio_backend.experience.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.experience.domain.Experience;
import com.gonzalomartinez.portfolio_backend.experience.domain.ExperienceRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExperienceUseCaseService implements ManageExperienceUseCase {
    
    private static final Logger log = LoggerFactory.getLogger(ExperienceUseCaseService.class);
    
    private final ExperienceRepositoryPort experienceRepository;
    private final SanitizerPort inputSanitizer;

    public ExperienceUseCaseService(ExperienceRepositoryPort experienceRepository, SanitizerPort inputSanitizer) {
        this.experienceRepository = experienceRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Override
    public List<ExperienceDto> getAllExperiences() {
        return experienceRepository.findAllByOrderByEndDateDescStartDateDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExperienceDto getExperienceById(UUID id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        return convertToDto(experience);
    }

    @Override
    public ExperienceDto createExperience(ExperienceDto dto) {
        validateDates(dto);
        
        Experience experience = convertToEntity(dto, null);
        
        Experience savedExperience = experienceRepository.save(experience);
        log.info("Created experience: {} at {} (ID: {})", 
                savedExperience.positionEn(), savedExperience.companyEn(), savedExperience.id());
        
        return convertToDto(savedExperience);
    }

    @Override
    public ExperienceDto updateExperience(UUID id, ExperienceDto dto) {
        validateDates(dto);
        
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        
        Experience updatedExperience = convertToEntity(dto, id);
        
        Experience savedExperience = experienceRepository.save(updatedExperience);
        log.info("Updated experience: {} at {} (ID: {})", 
                savedExperience.positionEn(), savedExperience.companyEn(), savedExperience.id());
        
        return convertToDto(savedExperience);
    }

    @Override
    public void deleteExperience(UUID id) {
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        
        experienceRepository.deleteById(id);
        log.info("Deleted experience with ID: {}", id);
    }

    private void validateDates(ExperienceDto dto) {
        if (dto.endDate() != null && dto.startDate().isAfter(dto.endDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }

    private ExperienceDto convertToDto(Experience experience) {
        return new ExperienceDto(
                experience.id(),
                experience.companyEn(),
                experience.companyEs(),
                experience.positionEn(),
                experience.positionEs(),
                experience.startDate(),
                experience.endDate(),
                experience.descriptionEn(),
                experience.descriptionEs(),
                experience.technologies()
        );
    }

    private Experience convertToEntity(ExperienceDto dto, UUID id) {
        return new Experience(
                id,
                inputSanitizer.sanitize(dto.companyEn()),
                inputSanitizer.sanitize(dto.companyEs()),
                inputSanitizer.sanitize(dto.positionEn()),
                inputSanitizer.sanitize(dto.positionEs()),
                dto.startDate(),
                dto.endDate(),
                inputSanitizer.sanitize(dto.descriptionEn()),
                inputSanitizer.sanitize(dto.descriptionEs()),
                dto.technologies() != null ? dto.technologies() : List.of()
        );
    }
}
