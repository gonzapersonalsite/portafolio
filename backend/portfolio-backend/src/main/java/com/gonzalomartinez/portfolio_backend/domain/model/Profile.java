package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // --- HOME PAGE SECTION ---

    @Size(max = 100)
    @Column(length = 100)
    private String greetingEn;

    @Size(max = 100)
    @Column(length = 100)
    private String greetingEs;

    @Size(max = 255)
    @Column(length = 255)
    private String titleEn;

    @Size(max = 255)
    @Column(length = 255)
    private String titleEs;

    @Size(max = 255)
    @Column(length = 255)
    private String subtitleEn;

    @Size(max = 255)
    @Column(length = 255)
    private String subtitleEs;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionEs;

    // --- ABOUT PAGE SECTION ---

    @Size(max = 255)
    @Column(length = 255)
    private String aboutTitleEn;

    @Size(max = 255)
    @Column(length = 255)
    private String aboutTitleEs;

    @Size(max = 255)
    @Column(length = 255)
    private String aboutIntroTitleEn;

    @Size(max = 255)
    @Column(length = 255)
    private String aboutIntroTitleEs;

    @Column(columnDefinition = "TEXT")
    private String aboutSummaryEn;

    @Column(columnDefinition = "TEXT")
    private String aboutSummaryEs;

    @Column(columnDefinition = "TEXT")
    private String aboutPhilosophyEn;

    @Column(columnDefinition = "TEXT")
    private String aboutPhilosophyEs;

    // --- CV / GENERAL ---
    
    @Size(max = 255)
    @Column(length = 255)
    private String cvUrl;

    // --- PERSONAL / SOCIAL ---

    @Size(max = 100)
    @Column(length = 100)
    private String fullNameEn;

    @Size(max = 100)
    @Column(length = 100)
    private String fullNameEs;

    @Size(max = 100)
    @Column(length = 100)
    private String email;

    @Size(max = 255)
    @Column(length = 255)
    private String githubUrl;

    @Size(max = 255)
    @Column(length = 255)
    private String linkedinUrl;

    @Size(max = 100)
    @Column(length = 100)
    private String locationEn;

    @Size(max = 100)
    @Column(length = 100)
    private String locationEs;

    @Size(max = 255)
    @Column(length = 255)
    private String logoText;

    @Size(max = 255)
    @Column(length = 255)
    private String imageUrl;
}
