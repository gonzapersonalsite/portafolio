package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
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
    
    @Column(nullable = false, length = 150)
    private String companyEn;
    
    @Column(nullable = false, length = 150)
    private String companyEs;
    
    @Column(nullable = false, length = 150)
    private String positionEn;
    
    @Column(nullable = false, length = 150)
    private String positionEs;
    
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
    
}
