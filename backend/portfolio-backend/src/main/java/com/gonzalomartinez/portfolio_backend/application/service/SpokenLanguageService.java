package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.domain.model.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.domain.repository.SpokenLanguageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SpokenLanguageService {

    private final SpokenLanguageRepository spokenLanguageRepository;

    public List<SpokenLanguage> getAllSpokenLanguages() {
        return spokenLanguageRepository.findAllByOrderByOrderAsc();
    }

    public SpokenLanguage createSpokenLanguage(SpokenLanguage spokenLanguage) {
        return spokenLanguageRepository.save(spokenLanguage);
    }

    public SpokenLanguage updateSpokenLanguage(UUID id, SpokenLanguage spokenLanguageDetails) {
        SpokenLanguage spokenLanguage = spokenLanguageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Language not found with id: " + id));

        spokenLanguage.setNameEn(spokenLanguageDetails.getNameEn());
        spokenLanguage.setNameEs(spokenLanguageDetails.getNameEs());
        spokenLanguage.setLevelEn(spokenLanguageDetails.getLevelEn());
        spokenLanguage.setLevelEs(spokenLanguageDetails.getLevelEs());
        spokenLanguage.setProficiency(spokenLanguageDetails.getProficiency());
        spokenLanguage.setOrder(spokenLanguageDetails.getOrder());

        return spokenLanguageRepository.save(spokenLanguage);
    }

    public void deleteSpokenLanguage(UUID id) {
        SpokenLanguage spokenLanguage = spokenLanguageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Language not found with id: " + id));
        spokenLanguageRepository.delete(spokenLanguage);
    }
}
