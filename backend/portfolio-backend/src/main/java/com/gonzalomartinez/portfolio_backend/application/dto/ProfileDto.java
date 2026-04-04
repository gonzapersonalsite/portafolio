package com.gonzalomartinez.portfolio_backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private UUID id;
    
    // Home Page
    private String greetingEn;
    private String greetingEs;
    private String titleEn;
    private String titleEs;
    private String subtitleEn;
    private String subtitleEs;
    private String descriptionEn;
    private String descriptionEs;

    // About Page
    private String aboutTitleEn;
    private String aboutTitleEs;
    private String aboutIntroTitleEn;
    private String aboutIntroTitleEs;
    private String aboutSummaryEn;
    private String aboutSummaryEs;
    private String aboutPhilosophyEn;
    private String aboutPhilosophyEs;
    
    // Sentence
    private String sentenceEn;
    private String sentenceEs;

    // CV
    private String cvUrl;

    // Personal / Social
    private String fullNameEn;
    private String fullNameEs;
    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String locationEn;
    private String locationEs;
    private String logoText;
    private String imageUrl;
}