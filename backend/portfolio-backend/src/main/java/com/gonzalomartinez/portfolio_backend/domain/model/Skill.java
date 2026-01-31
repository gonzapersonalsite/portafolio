package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String nameEn;
    
    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String nameEs;
    
    @NotNull(message = "Level is required")
    @Min(value = 0, message = "Level must be at least 0")
    @Max(value = 100, message = "Level must not exceed 100")
    @Column(nullable = false)
    private Integer level;
    
    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Column(length = 50)
    private String category;
    
    @Size(max = 255, message = "Icon URL must not exceed 255 characters")
    @Column(length = 255)
    private String iconUrl;
    
    @Column(name = "display_order")
    private Integer order;
}
