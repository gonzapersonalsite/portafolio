package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.dto.SkillDto;
import com.gonzalomartinez.portfolio_backend.application.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {
    
    private final SkillService skillService;
    
    @GetMapping
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> getSkillById(@PathVariable UUID id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }
    
    @PostMapping
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillDto skillDto) {
        SkillDto createdSkill = skillService.createSkill(skillDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSkill);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> updateSkill(
            @PathVariable UUID id,
            @Valid @RequestBody SkillDto skillDto
    ) {
        SkillDto updatedSkill = skillService.updateSkill(id, skillDto);
        return ResponseEntity.ok(updatedSkill);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable UUID id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
