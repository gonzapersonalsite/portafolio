package com.gonzalomartinez.portfolio_backend.language.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguageRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
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
class SpokenLanguageUseCaseServiceTest {

    @Mock
    private SpokenLanguageRepositoryPort spokenLanguageRepository;

    @Mock
    private SanitizerPort inputSanitizer;

    @InjectMocks
    private SpokenLanguageUseCaseService spokenLanguageService;

    private SpokenLanguage spokenLanguage;
    private UUID spokenLanguageId;

    @BeforeEach
    void setUp() {
        spokenLanguageId = UUID.randomUUID();
        spokenLanguage = new SpokenLanguage(
                spokenLanguageId,
                "Spanish",
                "Espanol",
                "Native",
                "Nativo",
                100,
                1
        );

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllSpokenLanguages_ReturnsList() {
        when(spokenLanguageRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(spokenLanguage));

        List<SpokenLanguageDto> result = spokenLanguageService.getAllSpokenLanguages();

        assertEquals(1, result.size());
        assertEquals("Spanish", result.get(0).nameEn());
    }

    @Test
    void createSpokenLanguage_ReturnsSavedDto() {
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = new SpokenLanguageDto(
                null, "English", "Ingles", "Fluent", "Fluido", 85, 2
        );

        SpokenLanguageDto result = spokenLanguageService.createSpokenLanguage(dto);

        assertNotNull(result.id());
        assertEquals("Spanish", result.nameEn());
        verify(spokenLanguageRepository).save(any(SpokenLanguage.class));
    }

    @Test
    void createSpokenLanguage_WithNullOrder_SetsNextOrder() {
        List<SpokenLanguage> existing = List.of(
                new SpokenLanguage(UUID.randomUUID(), "L1", "L1", "L1", "L1", 10, 2),
                new SpokenLanguage(UUID.randomUUID(), "L2", "L2", "L2", "L2", 20, 5)
        );
        when(spokenLanguageRepository.findAll()).thenReturn(existing);
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = new SpokenLanguageDto(
                null, "French", "Frances", "Intermediate", "Intermedio", 40, null
        );

        spokenLanguageService.createSpokenLanguage(dto);

        verify(spokenLanguageRepository).findAll();
    }

    @Test
    void createSpokenLanguage_WithNullOrEmptyRepo_OrderIsOne() {
        when(spokenLanguageRepository.findAll()).thenReturn(List.of());
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenAnswer(i -> i.getArgument(0));

        SpokenLanguageDto dto = new SpokenLanguageDto(
                null, "German", "Aleman", "Basic", "Basico", 20, null
        );

        SpokenLanguageDto result = spokenLanguageService.createSpokenLanguage(dto);

        assertEquals(Integer.valueOf(1), result.order());
    }

    @Test
    void updateSpokenLanguage_WhenFound_ReturnsUpdatedDto() {
        when(spokenLanguageRepository.existsById(spokenLanguageId)).thenReturn(true);
        when(spokenLanguageRepository.save(any(SpokenLanguage.class))).thenReturn(spokenLanguage);

        SpokenLanguageDto dto = new SpokenLanguageDto(
                null, "Spanish Updated", "Espanol Actualizado", "Native", "Nativo", 100, 1
        );

        SpokenLanguageDto result = spokenLanguageService.updateSpokenLanguage(spokenLanguageId, dto);

        assertNotNull(result);
        verify(spokenLanguageRepository).save(any(SpokenLanguage.class));
    }

    @Test
    void updateSpokenLanguage_WhenNotFound_ThrowsException() {
        when(spokenLanguageRepository.existsById(spokenLanguageId)).thenReturn(false);

        SpokenLanguageDto dto = new SpokenLanguageDto(
                null, "Test", "Test", "Test", "Test", 50, null
        );

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
