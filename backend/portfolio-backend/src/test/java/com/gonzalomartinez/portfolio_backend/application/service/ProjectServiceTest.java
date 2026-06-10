package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Project;
import com.gonzalomartinez.portfolio_backend.domain.model.ProjectType;
import com.gonzalomartinez.portfolio_backend.domain.repository.ProjectRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private InputSanitizer inputSanitizer;

    @InjectMocks
    private ProjectService projectService;

    private Project project;
    private UUID projectId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        project = Project.builder()
                .id(projectId)
                .titleEn("Portfolio Website")
                .titleEs("Sitio Web Portafolio")
                .descriptionEn("A personal portfolio")
                .descriptionEs("Un portafolio personal")
                .imageUrls(List.of("https://example.com/img.png"))
                .technologies(List.of("React", "Spring"))
                .githubUrl("https://github.com/test/repo")
                .liveUrl("https://example.com")
                .type(ProjectType.WEB)
                .featured(true)
                .order(1)
                .build();

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllProjects_ReturnsList() {
        when(projectRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(project));

        List<ProjectDto> result = projectService.getAllProjects();

        assertEquals(1, result.size());
        assertEquals("Portfolio Website", result.get(0).getTitleEn());
    }

    @Test
    void getFeaturedProjects_ReturnsFeaturedOnly() {
        when(projectRepository.findByFeaturedTrueOrderByOrderAsc()).thenReturn(List.of(project));

        List<ProjectDto> result = projectService.getFeaturedProjects();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getFeatured());
    }

    @Test
    void getProjectById_WhenFound_ReturnsDto() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        ProjectDto result = projectService.getProjectById(projectId);

        assertEquals("Portfolio Website", result.getTitleEn());
        assertEquals(ProjectType.WEB, result.getType());
        assertEquals(1, result.getOrder());
    }

    @Test
    void getProjectById_WhenNotFound_ThrowsException() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> projectService.getProjectById(projectId));
    }

    @Test
    void createProject_ReturnsSavedDto() {
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDto dto = ProjectDto.builder()
                .titleEn("Portfolio Website")
                .titleEs("Sitio Web Portafolio")
                .type(ProjectType.WEB)
                .featured(true)
                .order(1)
                .technologies(List.of("React"))
                .build();

        ProjectDto result = projectService.createProject(dto);

        assertNotNull(result.getId());
        assertEquals("Portfolio Website", result.getTitleEn());
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void createProject_WithNullOrder_SetsNextOrder() {
        when(projectRepository.findMaxOrder()).thenReturn(5);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDto dto = ProjectDto.builder()
                .titleEn("New Project")
                .titleEs("Nuevo Proyecto")
                .technologies(List.of())
                .build();

        projectService.createProject(dto);

        verify(projectRepository).findMaxOrder();
    }

    @Test
    void createProject_WithNullOrEmptyRepo_OrderIsOne() {
        when(projectRepository.findMaxOrder()).thenReturn(null);
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArgument(0));

        ProjectDto dto = ProjectDto.builder()
                .titleEn("First Project")
                .titleEs("Primer Proyecto")
                .technologies(List.of())
                .build();

        ProjectDto result = projectService.createProject(dto);

        assertEquals(Integer.valueOf(1), result.getOrder());
    }

    @Test
    void updateProject_WhenFound_ReturnsUpdatedDto() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDto dto = ProjectDto.builder()
                .titleEn("Updated Title")
                .titleEs("Titulo Actualizado")
                .technologies(List.of())
                .build();

        ProjectDto result = projectService.updateProject(projectId, dto);

        assertNotNull(result);
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void updateProject_WhenNotFound_ThrowsException() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        ProjectDto dto = ProjectDto.builder()
                .titleEn("Test")
                .titleEs("Test")
                .technologies(List.of())
                .build();

        assertThrows(ResourceNotFoundException.class,
                () -> projectService.updateProject(projectId, dto));
    }

    @Test
    void deleteProject_WhenExists_DeletesSuccessfully() {
        when(projectRepository.existsById(projectId)).thenReturn(true);

        projectService.deleteProject(projectId);

        verify(projectRepository).deleteById(projectId);
    }

    @Test
    void deleteProject_WhenNotFound_ThrowsException() {
        when(projectRepository.existsById(projectId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
                () -> projectService.deleteProject(projectId));
        verify(projectRepository, never()).deleteById(any());
    }
}
