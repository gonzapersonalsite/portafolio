package com.gonzalomartinez.portfolio_backend.skill.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.skill.domain.Skill;
import com.gonzalomartinez.portfolio_backend.skill.domain.SkillRepositoryPort;
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
class SkillUseCaseServiceTest {

    @Mock
    private SkillRepositoryPort skillRepository;

    @Mock
    private SanitizerPort inputSanitizer;

    @InjectMocks
    private SkillUseCaseService skillService;

    private Skill skill;
    private UUID skillId;

    @BeforeEach
    void setUp() {
        skillId = UUID.randomUUID();
        skill = new Skill(
                skillId,
                "Java",
                "Java",
                90,
                "Backend",
                "https://example.com/java.png",
                1
        );

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllSkills_ReturnsList() {
        when(skillRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(skill));

        List<SkillDto> result = skillService.getAllSkills();

        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).nameEn());
    }

    @Test
    void getSkillById_WhenFound_ReturnsDto() {
        when(skillRepository.findById(skillId)).thenReturn(Optional.of(skill));

        SkillDto result = skillService.getSkillById(skillId);

        assertEquals("Java", result.nameEn());
        assertEquals(90, result.level());
    }

    @Test
    void getSkillById_WhenNotFound_ThrowsException() {
        when(skillRepository.findById(skillId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> skillService.getSkillById(skillId));
    }

    @Test
    void createSkill_ReturnsSavedDto() {
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        SkillDto dto = new SkillDto(
                null, "Java", "Java", 90, "Backend", null, 1
        );

        SkillDto result = skillService.createSkill(dto);

        assertNotNull(result.id());
        assertEquals("Java", result.nameEn());
        assertEquals(90, result.level());
        verify(skillRepository).save(any(Skill.class));
    }

    @Test
    void createSkill_WithNullOrder_SetsNextOrder() {
        List<Skill> existingSkills = List.of(
                new Skill(UUID.randomUUID(), "S1", "S1", 10, "C1", null, 3),
                new Skill(UUID.randomUUID(), "S2", "S2", 20, "C2", null, 7)
        );
        when(skillRepository.findAll()).thenReturn(existingSkills);
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        SkillDto dto = new SkillDto(
                null, "Python", "Python", 80, null, null, null
        );

        skillService.createSkill(dto);

        verify(skillRepository).findAll();
    }

    @Test
    void createSkill_WithNullOrEmptyRepo_OrderIsOne() {
        when(skillRepository.findAll()).thenReturn(List.of());
        when(skillRepository.save(any(Skill.class))).thenAnswer(i -> i.getArgument(0));

        SkillDto dto = new SkillDto(
                null, "Go", "Go", 70, null, null, null
        );

        SkillDto result = skillService.createSkill(dto);

        assertEquals(Integer.valueOf(1), result.order());
    }

    @Test
    void updateSkill_WhenFound_ReturnsUpdatedDto() {
        when(skillRepository.existsById(skillId)).thenReturn(true);
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        SkillDto dto = new SkillDto(
                null, "Java 21", "Java 21", 95, "Backend", null, 1
        );

        SkillDto result = skillService.updateSkill(skillId, dto);

        assertNotNull(result);
        verify(skillRepository).save(any(Skill.class));
    }

    @Test
    void updateSkill_WhenNotFound_ThrowsException() {
        when(skillRepository.existsById(skillId)).thenReturn(false);

        SkillDto dto = new SkillDto(
                null, "Test", "Test", 50, null, null, null
        );

        assertThrows(ResourceNotFoundException.class,
                () -> skillService.updateSkill(skillId, dto));
    }

    @Test
    void deleteSkill_WhenExists_DeletesSuccessfully() {
        when(skillRepository.existsById(skillId)).thenReturn(true);

        skillService.deleteSkill(skillId);

        verify(skillRepository).deleteById(skillId);
    }

    @Test
    void deleteSkill_WhenNotFound_ThrowsException() {
        when(skillRepository.existsById(skillId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> skillService.deleteSkill(skillId));
        verify(skillRepository, never()).deleteById(any());
    }
}
