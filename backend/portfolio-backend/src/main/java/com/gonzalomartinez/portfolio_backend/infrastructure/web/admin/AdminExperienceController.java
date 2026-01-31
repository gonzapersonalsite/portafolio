package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.dto.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.application.service.ExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/experiences")
@RequiredArgsConstructor
public class AdminExperienceController {
    
    private final ExperienceService experienceService;
    
    @GetMapping
    public ResponseEntity<List<ExperienceDto>> getAllExperiences() {
        return ResponseEntity.ok(experienceService.getAllExperiences());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExperienceDto> getExperienceById(@PathVariable UUID id) {
        return ResponseEntity.ok(experienceService.getExperienceById(id));
    }
    
    @PostMapping
    public ResponseEntity<ExperienceDto> createExperience(@Valid @RequestBody ExperienceDto dto) {
        ExperienceDto created = experienceService.createExperience(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExperienceDto> updateExperience(
            @PathVariable UUID id,
            @Valid @RequestBody ExperienceDto dto
    ) {
        ExperienceDto updated = experienceService.updateExperience(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable UUID id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
