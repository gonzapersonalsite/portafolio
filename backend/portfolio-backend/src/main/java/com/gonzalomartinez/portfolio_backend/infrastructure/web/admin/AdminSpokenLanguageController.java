package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.service.SpokenLanguageService;
import com.gonzalomartinez.portfolio_backend.domain.model.SpokenLanguage;
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
    public ResponseEntity<List<SpokenLanguage>> getAllLanguages() {
        return ResponseEntity.ok(spokenLanguageService.getAllSpokenLanguages());
    }

    @PostMapping
    public ResponseEntity<SpokenLanguage> createLanguage(@RequestBody SpokenLanguage language) {
        return ResponseEntity.status(HttpStatus.CREATED).body(spokenLanguageService.createSpokenLanguage(language));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpokenLanguage> updateLanguage(@PathVariable UUID id, @RequestBody SpokenLanguage language) {
        return ResponseEntity.ok(spokenLanguageService.updateSpokenLanguage(id, language));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable UUID id) {
        spokenLanguageService.deleteSpokenLanguage(id);
        return ResponseEntity.noContent().build();
    }
}
