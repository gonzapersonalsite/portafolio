package com.gonzalomartinez.portfolio_backend.skill.domain;

import java.util.UUID;

public record Skill(
    UUID id,
    String nameEn,
    String nameEs,
    Integer level,
    String category,
    String iconUrl,
    Integer order
) {
    public Skill withOrder(Integer newOrder) {
        return new Skill(id, nameEn, nameEs, level, category, iconUrl, newOrder);
    }
}
