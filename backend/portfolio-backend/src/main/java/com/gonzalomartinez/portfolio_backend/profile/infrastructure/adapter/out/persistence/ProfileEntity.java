package com.gonzalomartinez.portfolio_backend.profile.infrastructure.adapter.out.persistence;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "profiles")
public class ProfileEntity {

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

    public ProfileEntity() {}

    public ProfileEntity(UUID id, String greetingEn, String greetingEs, String titleEn, String titleEs, String subtitleEn, String subtitleEs, String descriptionEn, String descriptionEs, String aboutTitleEn, String aboutTitleEs, String aboutIntroTitleEn, String aboutIntroTitleEs, String aboutSummaryEn, String aboutSummaryEs, String aboutPhilosophyEn, String aboutPhilosophyEs, String sentenceEn, String sentenceEs, String cvUrl, String fullNameEn, String fullNameEs, String email, String githubUrl, String linkedinUrl, String locationEn, String locationEs, String logoText, String imageUrl) {
        this.id = id;
        this.greetingEn = greetingEn;
        this.greetingEs = greetingEs;
        this.titleEn = titleEn;
        this.titleEs = titleEs;
        this.subtitleEn = subtitleEn;
        this.subtitleEs = subtitleEs;
        this.descriptionEn = descriptionEn;
        this.descriptionEs = descriptionEs;
        this.aboutTitleEn = aboutTitleEn;
        this.aboutTitleEs = aboutTitleEs;
        this.aboutIntroTitleEn = aboutIntroTitleEn;
        this.aboutIntroTitleEs = aboutIntroTitleEs;
        this.aboutSummaryEn = aboutSummaryEn;
        this.aboutSummaryEs = aboutSummaryEs;
        this.aboutPhilosophyEn = aboutPhilosophyEn;
        this.aboutPhilosophyEs = aboutPhilosophyEs;
        this.sentenceEn = sentenceEn;
        this.sentenceEs = sentenceEs;
        this.cvUrl = cvUrl;
        this.fullNameEn = fullNameEn;
        this.fullNameEs = fullNameEs;
        this.email = email;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.locationEn = locationEn;
        this.locationEs = locationEs;
        this.logoText = logoText;
        this.imageUrl = imageUrl;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getGreetingEn() { return greetingEn; }
    public void setGreetingEn(String greetingEn) { this.greetingEn = greetingEn; }
    public String getGreetingEs() { return greetingEs; }
    public void setGreetingEs(String greetingEs) { this.greetingEs = greetingEs; }
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }
    public String getSubtitleEn() { return subtitleEn; }
    public void setSubtitleEn(String subtitleEn) { this.subtitleEn = subtitleEn; }
    public String getSubtitleEs() { return subtitleEs; }
    public void setSubtitleEs(String subtitleEs) { this.subtitleEs = subtitleEs; }
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public String getDescriptionEs() { return descriptionEs; }
    public void setDescriptionEs(String descriptionEs) { this.descriptionEs = descriptionEs; }
    public String getAboutTitleEn() { return aboutTitleEn; }
    public void setAboutTitleEn(String aboutTitleEn) { this.aboutTitleEn = aboutTitleEn; }
    public String getAboutTitleEs() { return aboutTitleEs; }
    public void setAboutTitleEs(String aboutTitleEs) { this.aboutTitleEs = aboutTitleEs; }
    public String getAboutIntroTitleEn() { return aboutIntroTitleEn; }
    public void setAboutIntroTitleEn(String aboutIntroTitleEn) { this.aboutIntroTitleEn = aboutIntroTitleEn; }
    public String getAboutIntroTitleEs() { return aboutIntroTitleEs; }
    public void setAboutIntroTitleEs(String aboutIntroTitleEs) { this.aboutIntroTitleEs = aboutIntroTitleEs; }
    public String getAboutSummaryEn() { return aboutSummaryEn; }
    public void setAboutSummaryEn(String aboutSummaryEn) { this.aboutSummaryEn = aboutSummaryEn; }
    public String getAboutSummaryEs() { return aboutSummaryEs; }
    public void setAboutSummaryEs(String aboutSummaryEs) { this.aboutSummaryEs = aboutSummaryEs; }
    public String getAboutPhilosophyEn() { return aboutPhilosophyEn; }
    public void setAboutPhilosophyEn(String aboutPhilosophyEn) { this.aboutPhilosophyEn = aboutPhilosophyEn; }
    public String getAboutPhilosophyEs() { return aboutPhilosophyEs; }
    public void setAboutPhilosophyEs(String aboutPhilosophyEs) { this.aboutPhilosophyEs = aboutPhilosophyEs; }
    public String getSentenceEn() { return sentenceEn; }
    public void setSentenceEn(String sentenceEn) { this.sentenceEn = sentenceEn; }
    public String getSentenceEs() { return sentenceEs; }
    public void setSentenceEs(String sentenceEs) { this.sentenceEs = sentenceEs; }
    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }
    public String getFullNameEn() { return fullNameEn; }
    public void setFullNameEn(String fullNameEn) { this.fullNameEn = fullNameEn; }
    public String getFullNameEs() { return fullNameEs; }
    public void setFullNameEs(String fullNameEs) { this.fullNameEs = fullNameEs; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getLocationEn() { return locationEn; }
    public void setLocationEn(String locationEn) { this.locationEn = locationEn; }
    public String getLocationEs() { return locationEs; }
    public void setLocationEs(String locationEs) { this.locationEs = locationEs; }
    public String getLogoText() { return logoText; }
    public void setLogoText(String logoText) { this.logoText = logoText; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
