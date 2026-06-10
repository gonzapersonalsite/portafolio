package com.gonzalomartinez.portfolio_backend.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, length = 200)
    private String titleEn;
    
    @Column(nullable = false, length = 200)
    private String titleEs;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEs;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_images", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", length = 500)
    @OrderColumn(name = "image_order")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology")
    @Builder.Default
    private List<String> technologies = new ArrayList<>();
    
    @Column(length = 500)
    private String githubUrl;
    
    @Column(length = 500)
    private String liveUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ProjectType type = ProjectType.WEB;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;
    
    @Column(name = "display_order")
    private Integer order;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
