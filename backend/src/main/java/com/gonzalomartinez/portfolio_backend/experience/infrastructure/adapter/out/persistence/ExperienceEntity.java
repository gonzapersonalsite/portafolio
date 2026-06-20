package com.gonzalomartinez.portfolio_backend.experience.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "experiences")
public class ExperienceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String companyEn;

    @Column(nullable = false, length = 150)
    private String companyEs;

    @Column(nullable = false, length = 150)
    private String positionEn;

    @Column(nullable = false, length = 150)
    private String positionEs;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionEs;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "experience_technologies", joinColumns = @JoinColumn(name = "experience_id"))
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();

    public ExperienceEntity() {}

    public ExperienceEntity(UUID id, String companyEn, String companyEs, String positionEn, String positionEs, LocalDate startDate, LocalDate endDate, String descriptionEn, String descriptionEs, List<String> technologies) {
        this.id = id;
        this.companyEn = companyEn;
        this.companyEs = companyEs;
        this.positionEn = positionEn;
        this.positionEs = positionEs;
        this.startDate = startDate;
        this.endDate = endDate;
        this.descriptionEn = descriptionEn;
        this.descriptionEs = descriptionEs;
        this.technologies = technologies;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCompanyEn() { return companyEn; }
    public void setCompanyEn(String companyEn) { this.companyEn = companyEn; }
    public String getCompanyEs() { return companyEs; }
    public void setCompanyEs(String companyEs) { this.companyEs = companyEs; }
    public String getPositionEn() { return positionEn; }
    public void setPositionEn(String positionEn) { this.positionEn = positionEn; }
    public String getPositionEs() { return positionEs; }
    public void setPositionEs(String positionEs) { this.positionEs = positionEs; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public String getDescriptionEs() { return descriptionEs; }
    public void setDescriptionEs(String descriptionEs) { this.descriptionEs = descriptionEs; }
    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }
}
