package com.gonzalomartinez.portfolio_backend.language.application;

import java.util.List;
import java.util.UUID;

public interface ManageSpokenLanguageUseCase {
    List<SpokenLanguageDto> getAllSpokenLanguages();
    SpokenLanguageDto getSpokenLanguageById(UUID id);
    SpokenLanguageDto createSpokenLanguage(SpokenLanguageDto dto);
    SpokenLanguageDto updateSpokenLanguage(UUID id, SpokenLanguageDto dto);
    void deleteSpokenLanguage(UUID id);
}
