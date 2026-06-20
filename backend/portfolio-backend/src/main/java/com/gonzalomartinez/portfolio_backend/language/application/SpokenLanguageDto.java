package com.gonzalomartinez.portfolio_backend.language.application;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record SpokenLanguageDto(
    UUID id,

    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    String nameEn,

    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    String nameEs,

    @NotBlank(message = "English level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    String levelEn,

    @NotBlank(message = "Spanish level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    String levelEs,

    @Min(value = 0, message = "Proficiency must be at least 0")
    @Max(value = 100, message = "Proficiency must not exceed 100")
    Integer proficiency,

    Integer order
) {}
