package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "English name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String nameEn; // e.g., "Spanish"

    @NotBlank(message = "Spanish name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String nameEs; // e.g., "Español"

    @NotBlank(message = "English level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String levelEn; // e.g., "Native"

    @NotBlank(message = "Spanish level description is required")
    @Size(max = 100, message = "Level description must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String levelEs; // e.g., "Nativo"

    @Min(value = 0, message = "Proficiency must be at least 0")
    @Max(value = 100, message = "Proficiency must not exceed 100")
    @Column(nullable = false)
    private Integer proficiency; // 0-100 for ordering or progress bars logic if needed

    @Column(name = "display_order")
    private Integer order;
}
