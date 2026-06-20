package com.gonzalomartinez.portfolio_backend.experience.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.experience.application.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.experience.application.ManageExperienceUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/experiences")
public class AdminExperienceController {
    
    private final ManageExperienceUseCase experienceUseCase;

    public AdminExperienceController(ManageExperienceUseCase experienceUseCase) {
        this.experienceUseCase = experienceUseCase;
    }
    
    @GetMapping
    public ResponseEntity<List<ExperienceDto>> getAllExperiences() {
        return ResponseEntity.ok(experienceUseCase.getAllExperiences());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExperienceDto> getExperienceById(@PathVariable UUID id) {
        return ResponseEntity.ok(experienceUseCase.getExperienceById(id));
    }
    
    @PostMapping
    public ResponseEntity<ExperienceDto> createExperience(@Valid @RequestBody ExperienceDto dto) {
        ExperienceDto created = experienceUseCase.createExperience(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExperienceDto> updateExperience(
            @PathVariable UUID id,
            @Valid @RequestBody ExperienceDto dto
    ) {
        ExperienceDto updated = experienceUseCase.updateExperience(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID id) {
        experienceUseCase.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
