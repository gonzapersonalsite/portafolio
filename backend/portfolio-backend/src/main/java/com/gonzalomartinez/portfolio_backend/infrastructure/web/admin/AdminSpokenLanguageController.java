package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.dto.SpokenLanguageDto;
import com.gonzalomartinez.portfolio_backend.application.service.SpokenLanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/spoken-languages")
@RequiredArgsConstructor
public class AdminSpokenLanguageController {

    private final SpokenLanguageService spokenLanguageService;

    @GetMapping
    public ResponseEntity<List<SpokenLanguageDto>> getAllLanguages() {
        return ResponseEntity.ok(spokenLanguageService.getAllSpokenLanguages());
    }

    @PostMapping
    public ResponseEntity<SpokenLanguageDto> createLanguage(@Valid @RequestBody SpokenLanguageDto language) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spokenLanguageService.createSpokenLanguage(language));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpokenLanguageDto> updateLanguage(@PathVariable UUID id, @Valid @RequestBody SpokenLanguageDto language) {
        return ResponseEntity.ok(spokenLanguageService.updateSpokenLanguage(id, language));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable UUID id) {
        spokenLanguageService.deleteSpokenLanguage(id);
        return ResponseEntity.noContent().build();
    }
}
