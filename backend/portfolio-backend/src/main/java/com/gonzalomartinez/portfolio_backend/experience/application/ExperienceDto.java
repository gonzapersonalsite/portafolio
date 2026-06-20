package com.gonzalomartinez.portfolio_backend.experience.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ExperienceDto(
    UUID id,
    
    @NotBlank(message = "Company name (English) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    String companyEn,
    
    @NotBlank(message = "Company name (Spanish) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    String companyEs,
    
    @NotBlank(message = "Position (English) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    String positionEn,
    
    @NotBlank(message = "Position (Spanish) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    String positionEs,
    
    @NotNull(message = "Start date is required")
    LocalDate startDate,
    
    LocalDate endDate,
    
    String descriptionEn,
    
    String descriptionEs,
    
    List<String> technologies
) {}
