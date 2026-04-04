package com.gonzalomartinez.portfolio_backend.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpokenLanguageDto {

    private UUID id;

    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nameEn;

    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nameEs;

    @NotBlank(message = "English level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    private String levelEn;

    @NotBlank(message = "Spanish level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    private String levelEs;

    @Min(value = 0, message = "Proficiency must be at least 0")
    @Max(value = 100, message = "Proficiency must not exceed 100")
    private Integer proficiency;

    private Integer order;
}
