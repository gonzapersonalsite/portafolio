package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.SkillDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Skill;
import com.gonzalomartinez.portfolio_backend.domain.repository.SkillRepository;
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
public class SkillService {
    
    private final SkillRepository skillRepository;
    private final InputSanitizer inputSanitizer;
    
    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SkillDto getSkillById(UUID id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return convertToDto(skill);
    }
    
    @Transactional
    public SkillDto createSkill(SkillDto skillDto) {
        Skill skill = convertToEntity(skillDto);
        
        if (skill.getOrder() == null) {
            skill.setOrder(getNextOrder());
        }
        
        Skill savedSkill = skillRepository.save(skill);
        log.info("Created skill: {} (ID: {})", savedSkill.getNameEn(), savedSkill.getId());
        
        return convertToDto(savedSkill);
    }
    
    @Transactional
    public SkillDto updateSkill(UUID id, SkillDto skillDto) {
        Skill existingSkill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        
        existingSkill.setNameEn(inputSanitizer.sanitize(skillDto.getNameEn()));
        existingSkill.setNameEs(inputSanitizer.sanitize(skillDto.getNameEs()));
        existingSkill.setLevel(skillDto.getLevel());
        existingSkill.setCategory(inputSanitizer.sanitize(skillDto.getCategory()));
        existingSkill.setIconUrl(inputSanitizer.sanitizeUrl(skillDto.getIconUrl()));
        existingSkill.setOrder(skillDto.getOrder());
        
        Skill updatedSkill = skillRepository.save(existingSkill);
        log.info("Updated skill: {} (ID: {})", updatedSkill.getNameEn(), updatedSkill.getId());
        
        return convertToDto(updatedSkill);
    }
    
    @Transactional
    public void deleteSkill(UUID id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill", "id", id);
        }
        
        skillRepository.deleteById(id);
        log.info("Deleted skill with ID: {}", id);
    }
    
    private SkillDto convertToDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .nameEn(skill.getNameEn())
                .nameEs(skill.getNameEs())
                .level(skill.getLevel())
                .category(skill.getCategory())
                .iconUrl(skill.getIconUrl())
                .order(skill.getOrder())
                .build();
    }
    
    private Skill convertToEntity(SkillDto dto) {
        return Skill.builder()
                .nameEn(inputSanitizer.sanitize(dto.getNameEn()))
                .nameEs(inputSanitizer.sanitize(dto.getNameEs()))
                .level(dto.getLevel())
                .category(inputSanitizer.sanitize(dto.getCategory()))
                .iconUrl(inputSanitizer.sanitizeUrl(dto.getIconUrl()))
                .order(dto.getOrder())
                .build();
    }
    
    private Integer getNextOrder() {
        List<Skill> skills = skillRepository.findAll();
        return skills.stream()
                .map(Skill::getOrder)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }
}
