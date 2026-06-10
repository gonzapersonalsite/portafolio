package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
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
    
    @Column(nullable = false, length = 100)
    private String nameEn;
    
    @Column(nullable = false, length = 100)
    private String nameEs;
    
    @Column(nullable = false)
    private Integer level;
    
    @Column(length = 50)
    private String category;
    
    @Column(length = 255)
    private String iconUrl;
    
    @Column(name = "display_order")
    private Integer order;
}
