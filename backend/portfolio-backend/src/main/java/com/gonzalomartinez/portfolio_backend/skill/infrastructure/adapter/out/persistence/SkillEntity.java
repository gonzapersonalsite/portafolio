package com.gonzalomartinez.portfolio_backend.skill.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class SkillEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nameEn;

    @Column(nullable = false, length = 100)
    private String nameEs;

    @Column(nullable = false)
    private Integer level;

    @Column(length = 50)
    private String category;

    @Column(length = 255)
    private String iconUrl;

    @Column(name = "display_order")
    private Integer order;

    public SkillEntity() {}

    public SkillEntity(UUID id, String nameEn, String nameEs, Integer level, String category, String iconUrl, Integer order) {
        this.id = id;
        this.nameEn = nameEn;
        this.nameEs = nameEs;
        this.level = level;
        this.category = category;
        this.iconUrl = iconUrl;
        this.order = order;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNameEn() { return nameEn; }
    public void setNameEn(String nameEn) { this.nameEn = nameEn; }
    public String getNameEs() { return nameEs; }
    public void setNameEs(String nameEs) { this.nameEs = nameEs; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
}
