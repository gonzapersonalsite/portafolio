package com.gonzalomartinez.portfolio_backend.project.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.project.domain.Project;
import com.gonzalomartinez.portfolio_backend.project.domain.ProjectType;
import com.gonzalomartinez.portfolio_backend.project.domain.ProjectRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectUseCaseService implements ManageProjectUseCase {
    
    private static final Logger log = LoggerFactory.getLogger(ProjectUseCaseService.class);
    
    private final ProjectRepositoryPort projectRepository;
    private final SanitizerPort inputSanitizer;

    public ProjectUseCaseService(ProjectRepositoryPort projectRepository, SanitizerPort inputSanitizer) {
        this.projectRepository = projectRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Override
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDto> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderByOrderAsc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDto getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return convertToDto(project);
    }

    @Override
    @Transactional
    public ProjectDto createProject(ProjectDto dto) {
        Project project = convertToEntity(dto, null, LocalDateTime.now());
        
        if (project.order() == null) {
            project = project.withOrder(getNextOrder());
        }
        
        Project savedProject = projectRepository.save(project);
        log.info("Created project: {} (ID: {})", savedProject.titleEn(), savedProject.id());
        
        return convertToDto(savedProject);
    }

    @Override
    @Transactional
    public ProjectDto updateProject(UUID id, ProjectDto dto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        
        Project updatedProject = convertToEntity(dto, id, existingProject.createdAt());
        
        Project savedProject = projectRepository.save(updatedProject);
        log.info("Updated project: {} (ID: {})", savedProject.titleEn(), savedProject.id());
        
        return convertToDto(savedProject);
    }

    @Override
    @Transactional
    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        
        projectRepository.deleteById(id);
        log.info("Deleted project with ID: {}", id);
    }

    private ProjectDto convertToDto(Project project) {
        return new ProjectDto(
                project.id(),
                project.titleEn(),
                project.titleEs(),
                project.descriptionEn(),
                project.descriptionEs(),
                project.imageUrls(),
                project.technologies(),
                project.githubUrl(),
                project.liveUrl(),
                project.type(),
                project.featured(),
                project.order(),
                project.createdAt()
        );
    }

    private Project convertToEntity(ProjectDto dto, UUID id, LocalDateTime createdAt) {
        return new Project(
                id,
                inputSanitizer.sanitize(dto.titleEn()),
                inputSanitizer.sanitize(dto.titleEs()),
                inputSanitizer.sanitize(dto.descriptionEn()),
                inputSanitizer.sanitize(dto.descriptionEs()),
                sanitizeUrls(dto.imageUrls()),
                dto.technologies() != null ? dto.technologies() : List.of(),
                inputSanitizer.sanitizeUrl(dto.githubUrl()),
                inputSanitizer.sanitizeUrl(dto.liveUrl()),
                dto.type() != null ? dto.type() : ProjectType.WEB,
                dto.featured() != null ? dto.featured() : false,
                dto.order(),
                createdAt
        );
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
        Integer maxOrder = projectRepository.findMaxOrder();
        return (maxOrder != null ? maxOrder : 0) + 1;
    }
}
