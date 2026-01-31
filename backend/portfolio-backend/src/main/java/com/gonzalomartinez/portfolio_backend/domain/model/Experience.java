package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
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

@Entity
@Table(name = "experiences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Experience {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank(message = "Company name (English) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    @Column(nullable = false, length = 150)
    private String companyEn;
    
    @NotBlank(message = "Company name (Spanish) is required")
    @Size(max = 150, message = "Company name must not exceed 150 characters")
    @Column(nullable = false, length = 150)
    private String companyEs;
    
    @NotBlank(message = "Position (English) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    @Column(nullable = false, length = 150)
    private String positionEn;
    
    @NotBlank(message = "Position (Spanish) is required")
    @Size(max = 150, message = "Position must not exceed 150 characters")
    @Column(nullable = false, length = 150)
    private String positionEs;
    
    @NotNull(message = "Start date is required")
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column
    private LocalDate endDate;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEs;
    
    @ElementCollection
    @CollectionTable(name = "experience_technologies", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    
    @Column(name = "display_order")
    private Integer order;
}
