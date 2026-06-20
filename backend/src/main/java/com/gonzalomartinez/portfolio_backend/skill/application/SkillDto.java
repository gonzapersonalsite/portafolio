package com.gonzalomartinez.portfolio_backend.skill.application;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record SkillDto(
    UUID id,
    
    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    String nameEn,
    
    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    String nameEs,
    
    @NotNull(message = "Level is required")
    @Min(value = 0, message = "Level must be at least 0")
    @Max(value = 100, message = "Level must not exceed 100")
    Integer level,
    
    @Size(max = 50, message = "Category must not exceed 50 characters")
    String category,
    
    @Size(max = 255, message = "Icon URL must not exceed 255 characters")
    String iconUrl,
    
    Integer order
) {}
