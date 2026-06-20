package com.gonzalomartinez.portfolio_backend.project.application;

import com.gonzalomartinez.portfolio_backend.project.domain.ProjectType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectDto(
    UUID id,
    
    @NotBlank(message = "Title (English) is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    String titleEn,
    
    @NotBlank(message = "Title (Spanish) is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    String titleEs,
    
    String descriptionEn,
    String descriptionEs,
    
    List<String> imageUrls,
    List<String> technologies,
    
    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    String githubUrl,
    
    @Size(max = 500, message = "Live URL must not exceed 500 characters")
    String liveUrl,

    @JsonProperty("type")
    ProjectType type,
    
    Boolean featured,
    Integer order,
    LocalDateTime createdAt
) {}
