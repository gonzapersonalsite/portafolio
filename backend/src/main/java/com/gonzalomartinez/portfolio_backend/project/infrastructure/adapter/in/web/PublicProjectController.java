package com.gonzalomartinez.portfolio_backend.project.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.project.application.ProjectDto;
import com.gonzalomartinez.portfolio_backend.project.application.ManageProjectUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/projects")
public class PublicProjectController {

    private final ManageProjectUseCase projectUseCase;

    public PublicProjectController(ManageProjectUseCase projectUseCase) {
        this.projectUseCase = projectUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectUseCase.getAllProjects());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProjectDto>> getFeaturedProjects() {
        return ResponseEntity.ok(projectUseCase.getFeaturedProjects());
    }
}
