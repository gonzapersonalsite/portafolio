package com.gonzalomartinez.portfolio_backend.skill.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.skill.domain.Skill;
import com.gonzalomartinez.portfolio_backend.skill.domain.SkillRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SkillUseCaseService implements ManageSkillUseCase {

    private static final Logger log = LoggerFactory.getLogger(SkillUseCaseService.class);

    private final SkillRepositoryPort skillRepository;
    private final SanitizerPort inputSanitizer;

    public SkillUseCaseService(SkillRepositoryPort skillRepository, SanitizerPort inputSanitizer) {
        this.skillRepository = skillRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Override
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SkillDto getSkillById(UUID id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return convertToDto(skill);
    }

    @Override
    public SkillDto createSkill(SkillDto dto) {
        Skill skill = convertToEntity(dto, null);

        if (skill.order() == null) {
            skill = skill.withOrder(getNextOrder());
        }

        Skill savedSkill = skillRepository.save(skill);
        log.info("Created skill: {} (ID: {})", savedSkill.nameEn(), savedSkill.id());

        return convertToDto(savedSkill);
    }

    @Override
    public SkillDto updateSkill(UUID id, SkillDto dto) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill", "id", id);
        }

        Skill updatedSkill = convertToEntity(dto, id);

        Skill savedSkill = skillRepository.save(updatedSkill);
        log.info("Updated skill: {} (ID: {})", savedSkill.nameEn(), savedSkill.id());

        return convertToDto(savedSkill);
    }

    @Override
    public void deleteSkill(UUID id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill", "id", id);
        }

        skillRepository.deleteById(id);
        log.info("Deleted skill with ID: {}", id);
    }

    private SkillDto convertToDto(Skill skill) {
        return new SkillDto(
                skill.id(),
                skill.nameEn(),
                skill.nameEs(),
                skill.level(),
                skill.category(),
                skill.iconUrl(),
                skill.order()
        );
    }

    private Skill convertToEntity(SkillDto dto, UUID id) {
        return new Skill(
                id,
                inputSanitizer.sanitize(dto.nameEn()),
                inputSanitizer.sanitize(dto.nameEs()),
                dto.level(),
                inputSanitizer.sanitize(dto.category()),
                inputSanitizer.sanitizeUrl(dto.iconUrl()),
                dto.order()
        );
    }

    private Integer getNextOrder() {
        List<Skill> skills = skillRepository.findAll();
        return skills.stream()
                .map(Skill::order)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }
}
