package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.application.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }
    
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto dto) {
        ProjectDto created = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectDto dto
    ) {
        ProjectDto updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
