package com.gonzalomartinez.portfolio_backend.project.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.project.domain.Project;
import com.gonzalomartinez.portfolio_backend.project.domain.ProjectType;
import com.gonzalomartinez.portfolio_backend.project.domain.ProjectRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProjectUseCaseServiceTest {

    @Mock
    private ProjectRepositoryPort projectRepository;

    @Mock
    private SanitizerPort inputSanitizer;

    @InjectMocks
    private ProjectUseCaseService projectService;

    private Project project;
    private UUID projectId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        project = new Project(
                projectId,
                "Portfolio Website",
                "Sitio Web Portafolio",
                "A personal portfolio",
                "Un portafolio personal",
                List.of("https://example.com/img.png"),
                List.of("React", "Spring"),
                "https://github.com/test/repo",
                "https://example.com",
                ProjectType.WEB,
                true,
                1,
                LocalDateTime.now()
        );

        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getAllProjects_ReturnsList() {
        when(projectRepository.findAllByOrderByOrderAsc()).thenReturn(List.of(project));

        List<ProjectDto> result = projectService.getAllProjects();

        assertEquals(1, result.size());
        assertEquals("Portfolio Website", result.get(0).titleEn());
    }

    @Test
    void getFeaturedProjects_ReturnsFeaturedOnly() {
        when(projectRepository.findByFeaturedTrueOrderByOrderAsc()).thenReturn(List.of(project));

        List<ProjectDto> result = projectService.getFeaturedProjects();

        assertEquals(1, result.size());
        assertTrue(result.get(0).featured());
    }

    @Test
    void getProjectById_WhenFound_ReturnsDto() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        ProjectDto result = projectService.getProjectById(projectId);

        assertEquals("Portfolio Website", result.titleEn());
        assertEquals(ProjectType.WEB, result.type());
        assertEquals(1, result.order());
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

        ProjectDto dto = new ProjectDto(
                null, "Portfolio Website", "Sitio Web Portafolio", null, null, null, List.of("React"), null, null, ProjectType.WEB, true, 1, null
        );

        ProjectDto result = projectService.createProject(dto);

        assertNotNull(result.id());
        assertEquals("Portfolio Website", result.titleEn());
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void createProject_WithNullOrder_SetsNextOrder() {
        when(projectRepository.findMaxOrder()).thenReturn(5);
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDto dto = new ProjectDto(
                null, "New Project", "Nuevo Proyecto", null, null, null, List.of(), null, null, null, null, null, null
        );

        projectService.createProject(dto);

        verify(projectRepository).findMaxOrder();
    }

    @Test
    void createProject_WithNullOrEmptyRepo_OrderIsOne() {
        when(projectRepository.findMaxOrder()).thenReturn(null);
        when(projectRepository.save(any(Project.class))).thenAnswer(i -> i.getArgument(0));

        ProjectDto dto = new ProjectDto(
                null, "First Project", "Primer Proyecto", null, null, null, List.of(), null, null, null, null, null, null
        );

        ProjectDto result = projectService.createProject(dto);

        assertEquals(Integer.valueOf(1), result.order());
    }

    @Test
    void updateProject_WhenFound_ReturnsUpdatedDto() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        ProjectDto dto = new ProjectDto(
                null, "Updated Title", "Titulo Actualizado", null, null, null, List.of(), null, null, null, null, null, null
        );

        ProjectDto result = projectService.updateProject(projectId, dto);

        assertNotNull(result);
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void updateProject_WhenNotFound_ThrowsException() {
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        ProjectDto dto = new ProjectDto(
                null, "Test", "Test", null, null, null, List.of(), null, null, null, null, null, null
        );

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
