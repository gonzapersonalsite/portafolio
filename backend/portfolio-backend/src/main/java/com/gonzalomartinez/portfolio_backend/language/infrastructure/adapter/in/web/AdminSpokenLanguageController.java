package com.gonzalomartinez.portfolio_backend.language.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.language.application.SpokenLanguageDto;
import com.gonzalomartinez.portfolio_backend.language.application.ManageSpokenLanguageUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/spoken-languages")
public class AdminSpokenLanguageController {

    private final ManageSpokenLanguageUseCase spokenLanguageUseCase;

    public AdminSpokenLanguageController(ManageSpokenLanguageUseCase spokenLanguageUseCase) {
        this.spokenLanguageUseCase = spokenLanguageUseCase;
    }

    @GetMapping
    public ResponseEntity<List<SpokenLanguageDto>> getAllSpokenLanguages() {
        return ResponseEntity.ok(spokenLanguageUseCase.getAllSpokenLanguages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpokenLanguageDto> getSpokenLanguageById(@PathVariable UUID id) {
        return ResponseEntity.ok(spokenLanguageUseCase.getSpokenLanguageById(id));
    }

    @PostMapping
    public ResponseEntity<SpokenLanguageDto> createSpokenLanguage(@Valid @RequestBody SpokenLanguageDto dto) {
        SpokenLanguageDto created = spokenLanguageUseCase.createSpokenLanguage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpokenLanguageDto> updateSpokenLanguage(
            @PathVariable UUID id,
            @Valid @RequestBody SpokenLanguageDto dto
    ) {
        SpokenLanguageDto updated = spokenLanguageUseCase.updateSpokenLanguage(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpokenLanguage(@PathVariable UUID id) {
        spokenLanguageUseCase.deleteSpokenLanguage(id);
        return ResponseEntity.noContent().build();
    }
}
