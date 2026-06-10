package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "spoken_languages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpokenLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nameEn;

    @Column(nullable = false, length = 100)
    private String nameEs;

    @Column(nullable = false, length = 100)
    private String levelEn;

    @Column(nullable = false, length = 100)
    private String levelEs;

    @Column(nullable = false)
    private Integer proficiency;

    @Column(name = "display_order")
    private Integer order;
}
