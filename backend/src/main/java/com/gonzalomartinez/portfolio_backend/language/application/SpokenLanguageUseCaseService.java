package com.gonzalomartinez.portfolio_backend.language.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguageRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SpokenLanguageUseCaseService implements ManageSpokenLanguageUseCase {

    private static final Logger log = LoggerFactory.getLogger(SpokenLanguageUseCaseService.class);

    private final SpokenLanguageRepositoryPort spokenLanguageRepository;
    private final SanitizerPort inputSanitizer;

    public SpokenLanguageUseCaseService(SpokenLanguageRepositoryPort spokenLanguageRepository, SanitizerPort inputSanitizer) {
        this.spokenLanguageRepository = spokenLanguageRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Override
    public List<SpokenLanguageDto> getAllSpokenLanguages() {
        return spokenLanguageRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SpokenLanguageDto getSpokenLanguageById(UUID id) {
        SpokenLanguage language = spokenLanguageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SpokenLanguage", "id", id));
        return convertToDto(language);
    }

    @Override
    @Transactional
    public SpokenLanguageDto createSpokenLanguage(SpokenLanguageDto dto) {
        SpokenLanguage language = convertToEntity(dto, null);

        if (language.order() == null) {
            language = language.withOrder(getNextOrder());
        }

        SpokenLanguage savedLanguage = spokenLanguageRepository.save(language);
        log.info("Created spoken language: {} (ID: {})", savedLanguage.nameEn(), savedLanguage.id());

        return convertToDto(savedLanguage);
    }

    @Override
    @Transactional
    public SpokenLanguageDto updateSpokenLanguage(UUID id, SpokenLanguageDto dto) {
        if (!spokenLanguageRepository.existsById(id)) {
            throw new ResourceNotFoundException("SpokenLanguage", "id", id);
        }

        SpokenLanguage updatedLanguage = convertToEntity(dto, id);

        SpokenLanguage savedLanguage = spokenLanguageRepository.save(updatedLanguage);
        log.info("Updated spoken language: {} (ID: {})", savedLanguage.nameEn(), savedLanguage.id());

        return convertToDto(savedLanguage);
    }

    @Override
    @Transactional
    public void deleteSpokenLanguage(UUID id) {
        if (!spokenLanguageRepository.existsById(id)) {
            throw new ResourceNotFoundException("SpokenLanguage", "id", id);
        }

        spokenLanguageRepository.deleteById(id);
        log.info("Deleted spoken language with ID: {}", id);
    }

    private SpokenLanguageDto convertToDto(SpokenLanguage language) {
        return new SpokenLanguageDto(
                language.id(),
                language.nameEn(),
                language.nameEs(),
                language.levelEn(),
                language.levelEs(),
                language.proficiency(),
                language.order()
        );
    }

    private SpokenLanguage convertToEntity(SpokenLanguageDto dto, UUID id) {
        return new SpokenLanguage(
                id,
                inputSanitizer.sanitize(dto.nameEn()),
                inputSanitizer.sanitize(dto.nameEs()),
                inputSanitizer.sanitize(dto.levelEn()),
                inputSanitizer.sanitize(dto.levelEs()),
                dto.proficiency(),
                dto.order()
        );
    }

    private Integer getNextOrder() {
        Integer maxOrder = spokenLanguageRepository.findMaxOrder();
        return (maxOrder != null ? maxOrder : 0) + 1;
    }
}
