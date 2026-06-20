package com.gonzalomartinez.portfolio_backend.experience.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.experience.application.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.experience.application.ManageExperienceUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/experiences")
public class PublicExperienceController {

    private final ManageExperienceUseCase experienceUseCase;

    public PublicExperienceController(ManageExperienceUseCase experienceUseCase) {
        this.experienceUseCase = experienceUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ExperienceDto>> getAllExperiences() {
        return ResponseEntity.ok(experienceUseCase.getAllExperiences());
    }
}
