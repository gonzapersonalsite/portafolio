package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ExperienceDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Experience;
import com.gonzalomartinez.portfolio_backend.domain.repository.ExperienceRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ExperienceServiceTest {

    @Mock
    private ExperienceRepository experienceRepository;

    @Mock
    private InputSanitizer inputSanitizer;

    @InjectMocks
    private ExperienceService experienceService;

    private Experience experience;
    private UUID experienceId;

    @BeforeEach
    void setUp() {
        experienceId = UUID.randomUUID();
        experience = Experience.builder()
                .id(experienceId)
                .companyEn("Test Corp")
                .companyEs("Test Corp ES")
                .positionEn("Developer")
                .positionEs("Desarrollador")
                .startDate(LocalDate.of(2023, 1, 1))
                .endDate(null)
                .descriptionEn("Worked on projects")
                .descriptionEs("Trabajé en proyectos")
                .technologies(List.of("Java", "Spring"))
                .build();

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllExperiences_ReturnsList() {
        when(experienceRepository.findAllByOrderByEndDateDescStartDateDesc())
                .thenReturn(List.of(experience));

        List<ExperienceDto> result = experienceService.getAllExperiences();

        assertEquals(1, result.size());
        assertEquals("Test Corp", result.get(0).getCompanyEn());
    }

    @Test
    void getExperienceById_WhenFound_ReturnsDto() {
        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));

        ExperienceDto result = experienceService.getExperienceById(experienceId);

        assertEquals("Test Corp", result.getCompanyEn());
        assertEquals("Developer", result.getPositionEn());
    }

    @Test
    void getExperienceById_WhenNotFound_ThrowsException() {
        when(experienceRepository.findById(experienceId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> experienceService.getExperienceById(experienceId));
    }

    @Test
    void createExperience_ReturnsSavedDto() {
        when(experienceRepository.save(any(Experience.class))).thenReturn(experience);

        ExperienceDto dto = ExperienceDto.builder()
                .companyEn("Test Corp")
                .companyEs("Test Corp ES")
                .positionEn("Developer")
                .positionEs("Desarrollador")
                .startDate(LocalDate.of(2023, 1, 1))
                .technologies(List.of("Java"))
                .build();

        ExperienceDto result = experienceService.createExperience(dto);

        assertNotNull(result.getId());
        assertEquals("Test Corp", result.getCompanyEn());
        verify(experienceRepository).save(any(Experience.class));
    }

    @Test
    void createExperience_WithInvalidDates_ThrowsException() {
        ExperienceDto dto = ExperienceDto.builder()
                .companyEn("Test")
                .companyEs("Test")
                .positionEn("Dev")
                .positionEs("Dev")
                .startDate(LocalDate.of(2023, 6, 1))
                .endDate(LocalDate.of(2023, 1, 1))
                .build();

        assertThrows(IllegalArgumentException.class,
                () -> experienceService.createExperience(dto));
    }

    @Test
    void updateExperience_WhenFound_ReturnsUpdatedDto() {
        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));
        when(experienceRepository.save(any(Experience.class))).thenReturn(experience);

        ExperienceDto dto = ExperienceDto.builder()
                .companyEn("Updated Corp")
                .companyEs("Updated Corp ES")
                .positionEn("Senior Dev")
                .positionEs("Dev Senior")
                .startDate(LocalDate.of(2023, 1, 1))
                .technologies(List.of())
                .build();

        ExperienceDto result = experienceService.updateExperience(experienceId, dto);

        assertNotNull(result);
        verify(experienceRepository).save(any(Experience.class));
    }

    @Test
    void updateExperience_WhenNotFound_ThrowsException() {
        when(experienceRepository.findById(experienceId)).thenReturn(Optional.empty());

        ExperienceDto dto = ExperienceDto.builder()
                .companyEn("Test")
                .companyEs("Test")
                .positionEn("Dev")
                .positionEs("Dev")
                .startDate(LocalDate.now())
                .build();

        assertThrows(ResourceNotFoundException.class,
                () -> experienceService.updateExperience(experienceId, dto));
    }

    @Test
    void deleteExperience_WhenExists_DeletesSuccessfully() {
        when(experienceRepository.existsById(experienceId)).thenReturn(true);

        experienceService.deleteExperience(experienceId);

        verify(experienceRepository).deleteById(experienceId);
    }

    @Test
    void deleteExperience_WhenNotFound_ThrowsException() {
        when(experienceRepository.existsById(experienceId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> experienceService.deleteExperience(experienceId));
        verify(experienceRepository, never()).deleteById(any());
    }
}
