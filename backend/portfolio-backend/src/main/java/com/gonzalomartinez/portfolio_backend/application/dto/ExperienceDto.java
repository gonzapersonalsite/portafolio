package com.gonzalomartinez.portfolio_backend.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceDto {
    
    private UUID id;
    
    @NotBlank(message = "Company name (English) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyEn;
    
    @NotBlank(message = "Company name (Spanish) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    private String companyEs;
    
    @NotBlank(message = "Position (English) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    private String positionEn;
    
    @NotBlank(message = "Position (Spanish) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    private String positionEs;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String descriptionEn;
    
    private String descriptionEs;
    
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    
    private Integer order;
}
