package com.gonzalomartinez.portfolio_backend.profile.application;

import java.util.UUID;

public record ProfileDto(
    UUID id,
    String greetingEn,
    String greetingEs,
    String titleEn,
    String titleEs,
    String subtitleEn,
    String subtitleEs,
    String descriptionEn,
    String descriptionEs,
    String aboutTitleEn,
    String aboutTitleEs,
    String aboutIntroTitleEn,
    String aboutIntroTitleEs,
    String aboutSummaryEn,
    String aboutSummaryEs,
    String aboutPhilosophyEn,
    String aboutPhilosophyEs,
    String sentenceEn,
    String sentenceEs,
    String cvUrl,
    String fullNameEn,
    String fullNameEs,
    String email,
    String githubUrl,
    String linkedinUrl,
    String locationEn,
    String locationEs,
    String logoText,
    String imageUrl
) {}
