package com.gonzalomartinez.portfolio_backend.language.domain;

import java.util.UUID;

public record SpokenLanguage(
    UUID id,
    String nameEn,
    String nameEs,
    String levelEn,
    String levelEs,
    Integer proficiency,
    Integer order
) {
    public SpokenLanguage withOrder(Integer newOrder) {
        return new SpokenLanguage(id, nameEn, nameEs, levelEn, levelEs, proficiency, newOrder);
    }
}
