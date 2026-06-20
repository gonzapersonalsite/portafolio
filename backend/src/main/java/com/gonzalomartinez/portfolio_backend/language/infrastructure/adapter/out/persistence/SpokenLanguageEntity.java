package com.gonzalomartinez.portfolio_backend.language.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "spoken_languages")
public class SpokenLanguageEntity {

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

    public SpokenLanguageEntity() {}

    public SpokenLanguageEntity(UUID id, String nameEn, String nameEs, String levelEn, String levelEs, Integer proficiency, Integer order) {
        this.id = id;
        this.nameEn = nameEn;
        this.nameEs = nameEs;
        this.levelEn = levelEn;
        this.levelEs = levelEs;
        this.proficiency = proficiency;
        this.order = order;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public String getNameEs() { return nameEs; }
    public void setNameEs(String nameEs) { this.nameEs = nameEs; }
    public String getLevelEn() { return levelEn; }
    public void setLevelEn(String levelEn) { this.levelEn = levelEn; }
    public String getLevelEs() { return levelEs; }
    public void setLevelEs(String levelEs) { this.levelEs = levelEs; }
    public Integer getProficiency() { return proficiency; }
    public void setProficiency(Integer proficiency) { this.proficiency = proficiency; }
    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
}
