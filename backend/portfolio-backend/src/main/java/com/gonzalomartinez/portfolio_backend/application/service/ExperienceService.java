package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Experience;
import com.gonzalomartinez.portfolio_backend.domain.repository.ExperienceRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExperienceService {
    
    private final ExperienceRepository experienceRepository;
    private final InputSanitizer inputSanitizer;
    
    @Transactional(readOnly = true)
    public List<ExperienceDto> getAllExperiences() {
        return experienceRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ExperienceDto getExperienceById(UUID id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        return convertToDto(experience);
    }
    
    @Transactional
    public ExperienceDto createExperience(ExperienceDto dto) {
        validateDates(dto);
        
        Experience experience = convertToEntity(dto);
        
        if (experience.getOrder() == null) {
            experience.setOrder(getNextOrder());
        }
        
        Experience savedExperience = experienceRepository.save(experience);
        log.info("Created experience: {} at {} (ID: {})", 
                savedExperience.getPositionEn(), savedExperience.getCompanyEn(), savedExperience.getId());
        
        return convertToDto(savedExperience);
    }
    
    @Transactional
    public ExperienceDto updateExperience(UUID id, ExperienceDto dto) {
        validateDates(dto);
        
        Experience existingExperience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        
        existingExperience.setCompanyEn(inputSanitizer.sanitize(dto.getCompanyEn()));
        existingExperience.setCompanyEs(inputSanitizer.sanitize(dto.getCompanyEs()));
        existingExperience.setPositionEn(inputSanitizer.sanitize(dto.getPositionEn()));
        existingExperience.setPositionEs(inputSanitizer.sanitize(dto.getPositionEs()));
        existingExperience.setStartDate(dto.getStartDate());
        existingExperience.setEndDate(dto.getEndDate());
        existingExperience.setDescriptionEn(inputSanitizer.sanitize(dto.getDescriptionEn()));
        existingExperience.setDescriptionEs(inputSanitizer.sanitize(dto.getDescriptionEs()));
        existingExperience.setTechnologies(dto.getTechnologies());
        existingExperience.setOrder(dto.getOrder());
        
        Experience updatedExperience = experienceRepository.save(existingExperience);
        log.info("Updated experience: {} at {} (ID: {})", 
                updatedExperience.getPositionEn(), updatedExperience.getCompanyEn(), updatedExperience.getId());
        
        return convertToDto(updatedExperience);
    }
    
    @Transactional
    public void deleteExperience(UUID id) {
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        
        experienceRepository.deleteById(id);
        log.info("Deleted experience with ID: {}", id);
    }
    
    private void validateDates(ExperienceDto dto) {
        if (dto.getEndDate() != null && dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }
    
    private ExperienceDto convertToDto(Experience experience) {
        return ExperienceDto.builder()
                .id(experience.getId())
                .companyEn(experience.getCompanyEn())
                .companyEs(experience.getCompanyEs())
                .positionEn(experience.getPositionEn())
                .positionEs(experience.getPositionEs())
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .descriptionEn(experience.getDescriptionEn())
                .descriptionEs(experience.getDescriptionEs())
                .technologies(experience.getTechnologies())
                .order(experience.getOrder())
                .build();
    }
    
    private Experience convertToEntity(ExperienceDto dto) {
        return Experience.builder()
                .companyEn(inputSanitizer.sanitize(dto.getCompanyEn()))
                .companyEs(inputSanitizer.sanitize(dto.getCompanyEs()))
                .positionEn(inputSanitizer.sanitize(dto.getPositionEn()))
                .positionEs(inputSanitizer.sanitize(dto.getPositionEs()))
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .descriptionEn(inputSanitizer.sanitize(dto.getDescriptionEn()))
                .descriptionEs(inputSanitizer.sanitize(dto.getDescriptionEs()))
                .technologies(dto.getTechnologies())
                .order(dto.getOrder())
                .build();
    }
    
    private Integer getNextOrder() {
        List<Experience> experiences = experienceRepository.findAll();
        return experiences.stream()
                .map(Experience::getOrder)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }
}
