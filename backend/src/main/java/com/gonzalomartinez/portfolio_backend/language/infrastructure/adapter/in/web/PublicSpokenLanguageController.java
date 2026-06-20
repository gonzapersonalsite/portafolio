package com.gonzalomartinez.portfolio_backend.language.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.language.application.SpokenLanguageDto;
import com.gonzalomartinez.portfolio_backend.language.application.ManageSpokenLanguageUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/spoken-languages")
public class PublicSpokenLanguageController {

    private final ManageSpokenLanguageUseCase spokenLanguageUseCase;

    public PublicSpokenLanguageController(ManageSpokenLanguageUseCase spokenLanguageUseCase) {
        this.spokenLanguageUseCase = spokenLanguageUseCase;
    }

    @GetMapping
    public ResponseEntity<List<SpokenLanguageDto>> getAllSpokenLanguages() {
        return ResponseEntity.ok(spokenLanguageUseCase.getAllSpokenLanguages());
    }
}
