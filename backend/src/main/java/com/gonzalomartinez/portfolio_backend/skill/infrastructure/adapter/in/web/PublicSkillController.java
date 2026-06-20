package com.gonzalomartinez.portfolio_backend.skill.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.skill.application.SkillDto;
import com.gonzalomartinez.portfolio_backend.skill.application.ManageSkillUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/skills")
public class PublicSkillController {

    private final ManageSkillUseCase skillUseCase;

    public PublicSkillController(ManageSkillUseCase skillUseCase) {
        this.skillUseCase = skillUseCase;
    }

    @GetMapping
    public ResponseEntity<List<SkillDto>> getAllSkills() {
        return ResponseEntity.ok(skillUseCase.getAllSkills());
    }
}
