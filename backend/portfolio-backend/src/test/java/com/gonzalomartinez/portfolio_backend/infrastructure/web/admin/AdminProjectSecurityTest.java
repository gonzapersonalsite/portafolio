package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.application.service.ProjectService;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = true)
class AdminProjectSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    private String validProjectJson() throws Exception {
        ProjectDto dto = ProjectDto.builder()
                .titleEn("My Project")
                .titleEs("Mi Proyecto")
                .build();
        return objectMapper.writeValueAsString(dto);
    }

    @Test
    @DisplayName("Create project returns 401 when unauthenticated")
    void createProject_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProjectJson()))
                .andExpect(status().isUnauthorized());

        Mockito.verifyNoInteractions(projectService);
    }

    @Test
    @DisplayName("Create project returns 403 for non-admin authenticated user")
    @WithMockUser(username = "user", roles = {"USER"})
    void createProject_UserRole_Returns403() throws Exception {
        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProjectJson()))
                .andExpect(status().isForbidden());

        Mockito.verifyNoInteractions(projectService);
    }

    @Test
    @DisplayName("Create project succeeds (201) for ADMIN and invokes service")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createProject_AdminRole_Returns201_AndInvokesService() throws Exception {
        Mockito.when(projectService.createProject(any())).thenAnswer(inv -> {
            ProjectDto body = inv.getArgument(0);
            return ProjectDto.builder()
                    .titleEn(body.getTitleEn())
                    .titleEs(body.getTitleEs())
                    .build();
        });

        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validProjectJson()))
                .andExpect(status().isCreated());

        Mockito.verify(projectService, times(1)).createProject(any());
    }
}
