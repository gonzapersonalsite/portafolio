package com.gonzalomartinez.portfolio_backend.project.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.project.application.ProjectDto;
import com.gonzalomartinez.portfolio_backend.project.application.ManageProjectUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ManageProjectUseCase projectUseCase;

    public AdminProjectController(ManageProjectUseCase projectUseCase) {
        this.projectUseCase = projectUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectUseCase.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(projectUseCase.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto projectDto) {
        ProjectDto createdProject = projectUseCase.createProject(projectDto);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable UUID id, @Valid @RequestBody ProjectDto projectDto) {
        return ResponseEntity.ok(projectUseCase.updateProject(id, projectDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectUseCase.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
