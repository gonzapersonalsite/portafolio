package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.SpokenLanguageDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.domain.repository.SpokenLanguageRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SpokenLanguageServiceTest {

    @Mock
    private SpokenLanguageRepository spokenLanguageRepository;

    @Mock
    private InputSanitizer inputSanitizer;

    @InjectMocks
    private SpokenLanguageService spokenLanguageService;

    private SpokenLanguage spokenLanguage;
    private UUID spokenLanguageId;

    @BeforeEach
    void setUp() {
        spokenLanguageId = UUID.randomUUID();
        spokenLanguage = SpokenLanguage.builder()
                .id(spokenLanguageId)
                .nameEn("Spanish")
                .nameEs("Espanol")
                .levelEn("Native")
                .levelEs("Nativo")
                .proficiency(100)
                .order(1)
                .build();

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllSpokenLanguages_ReturnsList() {
        when(spokenLanguageRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(spokenLanguage));

        List<SpokenLanguageDto> result = spokenLanguageService.getAllSpokenLanguages();

        assertEquals(1, result.size());
        assertEquals("Spanish", result.get(0).getNameEn());
    }

    @Test
    void createSpokenLanguage_ReturnsSavedDto() {
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = SpokenLanguageDto.builder()
                .nameEn("English")
                .nameEs("Ingles")
                .levelEn("Fluent")
                .levelEs("Fluido")
                .proficiency(85)
                .order(2)
                .build();

        SpokenLanguageDto result = spokenLanguageService.createSpokenLanguage(dto);

        assertNotNull(result.getId());
        assertEquals("Spanish", result.getNameEn());
        verify(spokenLanguageRepository).save(any(SpokenLanguage.class));
    }

    @Test
    void createSpokenLanguage_WithNullOrder_SetsNextOrder() {
        List<SpokenLanguage> existing = List.of(
                SpokenLanguage.builder().order(2).build(),
                SpokenLanguage.builder().order(5).build()
        );
        when(spokenLanguageRepository.findAll()).thenReturn(existing);
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = SpokenLanguageDto.builder()
                .nameEn("French")
                .nameEs("Frances")
                .levelEn("Intermediate")
                .levelEs("Intermedio")
                .proficiency(40)
                .build();

        spokenLanguageService.createSpokenLanguage(dto);

        verify(spokenLanguageRepository).findAll();
    }

    @Test
    void createSpokenLanguage_WithNullOrEmptyRepo_OrderIsOne() {
        when(spokenLanguageRepository.findAll()).thenReturn(List.of());
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenAnswer(i -> i.getArgument(0));

        SpokenLanguageDto dto = SpokenLanguageDto.builder()
                .nameEn("German")
                .nameEs("Aleman")
                .levelEn("Basic")
                .levelEs("Basico")
                .proficiency(20)
                .build();

        SpokenLanguageDto result = spokenLanguageService.createSpokenLanguage(dto);

        assertEquals(Integer.valueOf(1), result.getOrder());
    }

    @Test
    void updateSpokenLanguage_WhenFound_ReturnsUpdatedDto() {
        when(spokenLanguageRepository.findById(spokenLanguageId)).thenReturn(Optional.of(spokenLanguage));
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = SpokenLanguageDto.builder()
                .nameEn("Spanish Updated")
                .nameEs("Espanol Actualizado")
                .levelEn("Native")
                .levelEs("Nativo")
                .proficiency(100)
                .order(1)
                .build();

        SpokenLanguageDto result = spokenLanguageService.updateSpokenLanguage(spokenLanguageId, dto);

        assertNotNull(result);
        verify(spokenLanguageRepository).save(any(SpokenLanguage.class));
    }

    @Test
    void updateSpokenLanguage_WhenNotFound_ThrowsException() {
        when(spokenLanguageRepository.findById(spokenLanguageId)).thenReturn(Optional.empty());

        SpokenLanguageDto dto = SpokenLanguageDto.builder()
                .nameEn("Test")
                .nameEs("Test")
                .levelEn("Test")
                .levelEs("Test")
                .proficiency(50)
                .build();

        assertThrows(ResourceNotFoundException.class,
                () -> spokenLanguageService.updateSpokenLanguage(spokenLanguageId, dto));
        verify(spokenLanguageRepository, never()).save(any());
    }

    @Test
    void deleteSpokenLanguage_WhenExists_DeletesSuccessfully() {
        when(spokenLanguageRepository.existsById(spokenLanguageId)).thenReturn(true);

        spokenLanguageService.deleteSpokenLanguage(spokenLanguageId);

        verify(spokenLanguageRepository).deleteById(spokenLanguageId);
    }

    @Test
    void deleteSpokenLanguage_WhenNotFound_ThrowsException() {
        when(spokenLanguageRepository.existsById(spokenLanguageId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> spokenLanguageService.deleteSpokenLanguage(spokenLanguageId));
        verify(spokenLanguageRepository, never()).deleteById(any());
    }
}
