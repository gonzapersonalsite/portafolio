package com.gonzalomartinez.portfolio_backend.experience.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.experience.domain.Experience;
import com.gonzalomartinez.portfolio_backend.experience.domain.ExperienceRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
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
class ExperienceUseCaseServiceTest {

    @Mock
    private ExperienceRepositoryPort experienceRepository;

    @Mock
    private SanitizerPort inputSanitizer;

    @InjectMocks
    private ExperienceUseCaseService experienceService;

    private Experience experience;
    private UUID experienceId;

    @BeforeEach
    void setUp() {
        experienceId = UUID.randomUUID();
        experience = new Experience(
                experienceId,
                "Test Corp",
                "Test Corp ES",
                "Developer",
                "Desarrollador",
                LocalDate.of(2023, 1, 1),
                null,
                "Worked on projects",
                "Trabajé en proyectos",
                List.of("Java", "Spring")
        );

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllExperiences_ReturnsList() {
        when(experienceRepository.findAllByOrderByEndDateDescStartDateDesc())
                .thenReturn(List.of(experience));

        List<ExperienceDto> result = experienceService.getAllExperiences();

        assertEquals(1, result.size());
        assertEquals("Test Corp", result.get(0).companyEn());
    }

    @Test
    void getExperienceById_WhenFound_ReturnsDto() {
        when(experienceRepository.findById(experienceId)).thenReturn(Optional.of(experience));

        ExperienceDto result = experienceService.getExperienceById(experienceId);

        assertEquals("Test Corp", result.companyEn());
        assertEquals("Developer", result.positionEn());
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

        ExperienceDto dto = new ExperienceDto(
                null, "Test Corp", "Test Corp ES", "Developer", "Desarrollador", LocalDate.of(2023, 1, 1), null, null, null, List.of("Java")
        );

        ExperienceDto result = experienceService.createExperience(dto);

        assertNotNull(result.id());
        assertEquals("Test Corp", result.companyEn());
        verify(experienceRepository).save(any(Experience.class));
    }

    @Test
    void createExperience_WithInvalidDates_ThrowsException() {
        ExperienceDto dto = new ExperienceDto(
                null, "Test", "Test", "Dev", "Dev", LocalDate.of(2023, 6, 1), LocalDate.of(2023, 1, 1), null, null, null
        );

        assertThrows(IllegalArgumentException.class,
                () -> experienceService.createExperience(dto));
    }

    @Test
    void updateExperience_WhenFound_ReturnsUpdatedDto() {
        when(experienceRepository.existsById(experienceId)).thenReturn(true);
        when(experienceRepository.save(any(Experience.class))).thenReturn(experience);

        ExperienceDto dto = new ExperienceDto(
                null, "Updated Corp", "Updated Corp ES", "Senior Dev", "Dev Senior", LocalDate.of(2023, 1, 1), null, null, null, List.of()
        );

        ExperienceDto result = experienceService.updateExperience(experienceId, dto);

        assertNotNull(result);
        verify(experienceRepository).save(any(Experience.class));
    }

    @Test
    void updateExperience_WhenNotFound_ThrowsException() {
        when(experienceRepository.existsById(experienceId)).thenReturn(false);

        ExperienceDto dto = new ExperienceDto(
                null, "Test", "Test", "Dev", "Dev", LocalDate.now(), null, null, null, null
        );

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
