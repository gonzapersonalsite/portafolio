package com.gonzalomartinez.portfolio_backend.project.application;

import java.util.List;
import java.util.UUID;

public interface ManageProjectUseCase {
    List<ProjectDto> getAllProjects();
    List<ProjectDto> getFeaturedProjects();
    ProjectDto getProjectById(UUID id);
    ProjectDto createProject(ProjectDto dto);
    ProjectDto updateProject(UUID id, ProjectDto dto);
    void deleteProject(UUID id);
}
