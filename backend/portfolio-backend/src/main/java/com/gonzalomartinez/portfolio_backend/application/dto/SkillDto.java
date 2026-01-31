package com.gonzalomartinez.portfolio_backend.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDto {
    
    private UUID id;
    
    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nameEn;
    
    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String nameEs;
    
    @NotNull(message = "Level is required")
    @Min(value = 0, message = "Level must be at least 0")
    @Max(value = 100, message = "Level must not exceed 100")
    private Integer level;
    
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;
    
    @Size(max = 255, message = "Icon URL must not exceed 255 characters")
    private String iconUrl;
    
    private Integer order;
}
