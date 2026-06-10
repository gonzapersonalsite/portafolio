package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.SkillDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Skill;
import com.gonzalomartinez.portfolio_backend.domain.repository.SkillRepository;
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
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private InputSanitizer inputSanitizer;

    @InjectMocks
    private SkillService skillService;

    private Skill skill;
    private UUID skillId;

    @BeforeEach
    void setUp() {
        skillId = UUID.randomUUID();
        skill = Skill.builder()
                .id(skillId)
                .nameEn("Java")
                .nameEs("Java")
                .level(90)
                .category("Backend")
                .iconUrl("https://example.com/java.png")
                .order(1)
                .build();

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllSkills_ReturnsList() {
        when(skillRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(skill));

        List<SkillDto> result = skillService.getAllSkills();

        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getNameEn());
    }

    @Test
    void getSkillById_WhenFound_ReturnsDto() {
        when(skillRepository.findById(skillId)).thenReturn(Optional.of(skill));

        SkillDto result = skillService.getSkillById(skillId);

        assertEquals("Java", result.getNameEn());
        assertEquals(90, result.getLevel());
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

        SkillDto dto = SkillDto.builder()
                .nameEn("Java")
                .nameEs("Java")
                .level(90)
                .category("Backend")
                .order(1)
                .build();

        SkillDto result = skillService.createSkill(dto);

        assertNotNull(result.getId());
        assertEquals("Java", result.getNameEn());
        assertEquals(90, result.getLevel());
        verify(skillRepository).save(any(Skill.class));
    }

    @Test
    void createSkill_WithNullOrder_SetsNextOrder() {
        List<Skill> existingSkills = List.of(
                Skill.builder().order(3).build(),
                Skill.builder().order(7).build()
        );
        when(skillRepository.findAll()).thenReturn(existingSkills);
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        SkillDto dto = SkillDto.builder()
                .nameEn("Python")
                .nameEs("Python")
                .level(80)
                .build();

        skillService.createSkill(dto);

        verify(skillRepository).findAll();
    }

    @Test
    void createSkill_WithNullOrEmptyRepo_OrderIsOne() {
        when(skillRepository.findAll()).thenReturn(List.of());
        when(skillRepository.save(any(Skill.class))).thenAnswer(i -> i.getArgument(0));

        SkillDto dto = SkillDto.builder()
                .nameEn("Go")
                .nameEs("Go")
                .level(70)
                .build();

        SkillDto result = skillService.createSkill(dto);

        assertEquals(Integer.valueOf(1), result.getOrder());
    }

    @Test
    void updateSkill_WhenFound_ReturnsUpdatedDto() {
        when(skillRepository.findById(skillId)).thenReturn(Optional.of(skill));
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        SkillDto dto = SkillDto.builder()
                .nameEn("Java 21")
                .nameEs("Java 21")
                .level(95)
                .category("Backend")
                .order(1)
                .build();

        SkillDto result = skillService.updateSkill(skillId, dto);

        assertNotNull(result);
        verify(skillRepository).save(any(Skill.class));
    }

    @Test
    void updateSkill_WhenNotFound_ThrowsException() {
        when(skillRepository.findById(skillId)).thenReturn(Optional.empty());

        SkillDto dto = SkillDto.builder()
                .nameEn("Test")
                .nameEs("Test")
                .level(50)
                .build();

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
