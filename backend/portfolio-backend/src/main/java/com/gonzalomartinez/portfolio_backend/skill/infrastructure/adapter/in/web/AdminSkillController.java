package com.gonzalomartinez.portfolio_backend.skill.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.skill.application.SkillDto;
import com.gonzalomartinez.portfolio_backend.skill.application.ManageSkillUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/skills")
public class AdminSkillController {
    
    private final ManageSkillUseCase skillUseCase;

    public AdminSkillController(ManageSkillUseCase skillUseCase) {
        this.skillUseCase = skillUseCase;
    }
    
    @GetMapping
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        return ResponseEntity.ok(skillUseCase.getAllSkills());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> getSkillById(@PathVariable UUID id) {
        return ResponseEntity.ok(skillUseCase.getSkillById(id));
    }
    
    @PostMapping
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillDto dto) {
        SkillDto created = skillUseCase.createSkill(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> updateSkill(
            @PathVariable UUID id,
            @Valid @RequestBody SkillDto dto
    ) {
        SkillDto updated = skillUseCase.updateSkill(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable UUID id) {
        skillUseCase.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
