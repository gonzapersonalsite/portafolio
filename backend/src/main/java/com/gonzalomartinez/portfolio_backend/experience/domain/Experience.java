package com.gonzalomartinez.portfolio_backend.experience.domain;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record Experience(
    UUID id,
    String companyEn,
    String companyEs,
    String positionEn,
    String positionEs,
    LocalDate startDate,
    LocalDate endDate,
    String descriptionEn,
    String descriptionEs,
    List<String> technologies
) {}
