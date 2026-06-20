package com.gonzalomartinez.portfolio_backend.project.domain;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record Project(
    UUID id,
    String titleEn,
    String titleEs,
    String descriptionEn,
    String descriptionEs,
    List<String> imageUrls,
    List<String> technologies,
    String githubUrl,
    String liveUrl,
    ProjectType type,
    Boolean featured,
    Integer order,
    LocalDateTime createdAt
) {
    public Project withOrder(Integer newOrder) {
        return new Project(id, titleEn, titleEs, descriptionEn, descriptionEs, imageUrls, technologies, githubUrl, liveUrl, type, featured, newOrder, createdAt);
    }
}
