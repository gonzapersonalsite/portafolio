package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
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

    @Column(length = 100)
    private String greetingEn;

    @Column(length = 100)
    private String greetingEs;

    @Column(length = 255)
    private String titleEn;

    @Column(length = 255)
    private String titleEs;

    @Column(length = 255)
    private String subtitleEn;

    @Column(length = 255)
    private String subtitleEs;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionEs;

    // --- ABOUT PAGE SECTION ---

    @Column(length = 255)
    private String aboutTitleEn;

    @Column(length = 255)
    private String aboutTitleEs;

    @Column(length = 255)
    private String aboutIntroTitleEn;

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

    // --- SENTENCE THAT DEFINES ME ---
    @Column(columnDefinition = "TEXT")
    private String sentenceEn;

    @Column(columnDefinition = "TEXT")
    private String sentenceEs;

    // --- CV / GENERAL ---
    
    @Column(length = 255)
    private String cvUrl;

    // --- PERSONAL / SOCIAL ---

    @Column(length = 100)
    private String fullNameEn;

    @Column(length = 100)
    private String fullNameEs;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String githubUrl;

    @Column(length = 255)
    private String linkedinUrl;

    @Column(length = 100)
    private String locationEn;

    @Column(length = 100)
    private String locationEs;

    @Column(length = 255)
    private String logoText;

    @Column(length = 255)
    private String imageUrl;
}
