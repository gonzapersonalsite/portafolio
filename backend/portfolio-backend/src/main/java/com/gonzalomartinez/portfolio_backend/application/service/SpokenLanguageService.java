package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.SpokenLanguageDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.domain.repository.SpokenLanguageRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpokenLanguageService {

    private final SpokenLanguageRepository spokenLanguageRepository;
    private final InputSanitizer inputSanitizer;

    @Transactional(readOnly = true)
    public List<SpokenLanguageDto> getAllSpokenLanguages() {
        return spokenLanguageRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SpokenLanguageDto createSpokenLanguage(SpokenLanguageDto dto) {
        SpokenLanguage spokenLanguage = convertToEntity(dto);
        
        if (spokenLanguage.getOrder() == null) {
            spokenLanguage.setOrder(getNextOrder());
        }
        
        SpokenLanguage saved = spokenLanguageRepository.save(spokenLanguage);
        log.info("Created spoken language: {} (ID: {})", saved.getNameEn(), saved.getId());
        
        return convertToDto(saved);
    }

    @Transactional
    public SpokenLanguageDto updateSpokenLanguage(UUID id, SpokenLanguageDto dto) {
        SpokenLanguage spokenLanguage = spokenLanguageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpokenLanguage", "id", id));

        spokenLanguage.setNameEn(inputSanitizer.sanitize(dto.getNameEn()));
        spokenLanguage.setNameEs(inputSanitizer.sanitize(dto.getNameEs()));
        spokenLanguage.setLevelEn(inputSanitizer.sanitize(dto.getLevelEn()));
        spokenLanguage.setLevelEs(inputSanitizer.sanitize(dto.getLevelEs()));
        spokenLanguage.setProficiency(dto.getProficiency());
        spokenLanguage.setOrder(dto.getOrder());

        SpokenLanguage updated = spokenLanguageRepository.save(spokenLanguage);
        log.info("Updated spoken language: {} (ID: {})", updated.getNameEn(), updated.getId());
        
        return convertToDto(updated);
    }

    @Transactional
    public void deleteSpokenLanguage(UUID id) {
        if (!spokenLanguageRepository.existsById(id)) {
            throw new ResourceNotFoundException("SpokenLanguage", "id", id);
        }
        spokenLanguageRepository.deleteById(id);
        log.info("Deleted spoken language with ID: {}", id);
    }
    
    private SpokenLanguageDto convertToDto(SpokenLanguage entity) {
        return SpokenLanguageDto.builder()
                .id(entity.getId())
                .nameEn(entity.getNameEn())
                .nameEs(entity.getNameEs())
                .levelEn(entity.getLevelEn())
                .levelEs(entity.getLevelEs())
                .proficiency(entity.getProficiency())
                .order(entity.getOrder())
                .build();
    }
    
    private SpokenLanguage convertToEntity(SpokenLanguageDto dto) {
        return SpokenLanguage.builder()
                .nameEn(inputSanitizer.sanitize(dto.getNameEn()))
                .nameEs(inputSanitizer.sanitize(dto.getNameEs()))
                .levelEn(inputSanitizer.sanitize(dto.getLevelEn()))
                .levelEs(inputSanitizer.sanitize(dto.getLevelEs()))
                .proficiency(dto.getProficiency())
                .order(dto.getOrder())
                .build();
    }
    
    private Integer getNextOrder() {
        List<SpokenLanguage> all = spokenLanguageRepository.findAll();
        return all.stream()
                .map(SpokenLanguage::getOrder)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }
}
