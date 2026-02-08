package com.gonzalomartinez.portfolio_backend.application.dto;

import com.gonzalomartinez.portfolio_backend.domain.model.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    
    private UUID id;
    
    @NotBlank(message = "Title (English) is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String titleEn;
    
    @NotBlank(message = "Title (Spanish) is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String titleEs;
    
    private String descriptionEn;
    
    private String descriptionEs;
    
    private String imageUrl;
    
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    
    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    private String githubUrl;
    
    @Size(max = 500, message = "Live URL must not exceed 500 characters")
    private String liveUrl;

    @Builder.Default
    private ProjectType type = ProjectType.WEB;
    
    @Builder.Default
    private Boolean featured = false;
    
    private Integer order;
    
    private LocalDateTime createdAt;
}
