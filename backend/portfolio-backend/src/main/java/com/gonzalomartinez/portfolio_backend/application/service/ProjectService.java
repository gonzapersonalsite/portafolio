package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Project;
import com.gonzalomartinez.portfolio_backend.domain.model.ProjectType;
import com.gonzalomartinez.portfolio_backend.domain.repository.ProjectRepository;
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
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final InputSanitizer inputSanitizer;
    
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProjectDto> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return convertToDto(project);
    }
    
    @Transactional
    public ProjectDto createProject(ProjectDto dto) {
        Project project = convertToEntity(dto);
        
        if (project.getOrder() == null) {
            project.setOrder(getNextOrder());
        }
        
        Project savedProject = projectRepository.save(project);
        log.info("Created project: {} (ID: {})", savedProject.getTitleEn(), savedProject.getId());
        
        return convertToDto(savedProject);
    }
    
    @Transactional
    public ProjectDto updateProject(UUID id, ProjectDto dto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        existingProject.setTitleEn(inputSanitizer.sanitize(dto.getTitleEn()));
        existingProject.setTitleEs(inputSanitizer.sanitize(dto.getTitleEs()));
        existingProject.setDescriptionEn(inputSanitizer.sanitize(dto.getDescriptionEn()));
        existingProject.setDescriptionEs(inputSanitizer.sanitize(dto.getDescriptionEs()));
        existingProject.setImageUrl(inputSanitizer.sanitizeUrl(dto.getImageUrl()));
        existingProject.setTechnologies(dto.getTechnologies());
        existingProject.setGithubUrl(inputSanitizer.sanitizeUrl(dto.getGithubUrl()));
        existingProject.setLiveUrl(inputSanitizer.sanitizeUrl(dto.getLiveUrl()));
        
        if (dto.getType() != null) {
            existingProject.setType(dto.getType());
        }

        existingProject.setFeatured(dto.getFeatured());
        existingProject.setOrder(dto.getOrder());
        
        Project updatedProject = projectRepository.save(existingProject);
        log.info("Updated project: {} (ID: {})", updatedProject.getTitleEn(), updatedProject.getId());
        
        return convertToDto(updatedProject);
    }
    
    @Transactional
    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        
        projectRepository.deleteById(id);
        log.info("Deleted project with ID: {}", id);
    }
    
    private ProjectDto convertToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .titleEn(project.getTitleEn())
                .titleEs(project.getTitleEs())
                .descriptionEn(project.getDescriptionEn())
                .descriptionEs(project.getDescriptionEs())
                .imageUrl(project.getImageUrl())
                .technologies(project.getTechnologies())
                .githubUrl(project.getGithubUrl())
                .liveUrl(project.getLiveUrl())
                .type(project.getType())
                .featured(project.getFeatured())
                .order(project.getOrder())
                .createdAt(project.getCreatedAt())
                .build();
    }
    
    private Project convertToEntity(ProjectDto dto) {
        return Project.builder()
                .titleEn(inputSanitizer.sanitize(dto.getTitleEn()))
                .titleEs(inputSanitizer.sanitize(dto.getTitleEs()))
                .descriptionEn(inputSanitizer.sanitize(dto.getDescriptionEn()))
                .descriptionEs(inputSanitizer.sanitize(dto.getDescriptionEs()))
                .imageUrl(inputSanitizer.sanitizeUrl(dto.getImageUrl()))
                .technologies(dto.getTechnologies())
                .githubUrl(inputSanitizer.sanitizeUrl(dto.getGithubUrl()))
                .liveUrl(inputSanitizer.sanitizeUrl(dto.getLiveUrl()))
                .type(dto.getType() != null ? dto.getType() : ProjectType.WEB)
                .featured(dto.getFeatured())
                .order(dto.getOrder())
                .build();
    }
    
    private List<String> sanitizeUrls(List<String> urls) {
        if (urls == null) {
            return List.of();
        }
        return urls.stream()
                .map(inputSanitizer::sanitizeUrl)
                .filter(url -> url != null && !url.isBlank())
                .collect(Collectors.toList());
    }
    
    private Integer getNextOrder() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(Project::getOrder)
                .max(Integer::compareTo)
                .orElse(0) + 1;
    }
}
