package com.gonzalomartinez.portfolio_backend.skill.application;

import java.util.List;
import java.util.UUID;

public interface ManageSkillUseCase {
    List<SkillDto> getAllSkills();
    SkillDto getSkillById(UUID id);
    SkillDto createSkill(SkillDto dto);
    SkillDto updateSkill(UUID id, SkillDto dto);
    void deleteSkill(UUID id);
}
