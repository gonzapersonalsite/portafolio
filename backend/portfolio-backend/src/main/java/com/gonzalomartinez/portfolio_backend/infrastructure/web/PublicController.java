package com.gonzalomartinez.portfolio_backend.infrastructure.web;

import com.gonzalomartinez.portfolio_backend.application.dto.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.application.dto.SkillDto;
import com.gonzalomartinez.portfolio_backend.application.service.ExperienceService;
import com.gonzalomartinez.portfolio_backend.application.service.ProjectService;
import com.gonzalomartinez.portfolio_backend.application.service.SkillService;
import com.gonzalomartinez.portfolio_backend.application.service.ProfileService;
import com.gonzalomartinez.portfolio_backend.application.service.SpokenLanguageService;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import com.gonzalomartinez.portfolio_backend.domain.model.SpokenLanguage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {
    
    private final SkillService skillService;
    private final ExperienceService experienceService;
    private final ProjectService projectService;
    private final ProfileService profileService;
    private final SpokenLanguageService spokenLanguageService;
    
    @GetMapping("/profile")
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @GetMapping("/spoken-languages")
    public ResponseEntity<List<SpokenLanguage>> getAllSpokenLanguages() {
        return ResponseEntity.ok(spokenLanguageService.getAllSpokenLanguages());
    }
    
    @GetMapping("/skills")
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }
    
    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceDto>> getAllExperiences() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }
    
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/projects/featured")
    public ResponseEntity<List<ProjectDto>> getFeaturedProjects() {
        return ResponseEntity.ok(projectService.getFeaturedProjects());
    }
}
