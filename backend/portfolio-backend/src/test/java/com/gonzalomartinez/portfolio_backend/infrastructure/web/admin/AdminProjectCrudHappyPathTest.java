package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalomartinez.portfolio_backend.application.dto.ProjectDto;
import com.gonzalomartinez.portfolio_backend.application.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = true)
class AdminProjectCrudHappyPathTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    private String projectJson() throws Exception {
        ProjectDto dto = ProjectDto.builder()
                .titleEn("P")
                .titleEs("P")
                .build();
        return objectMapper.writeValueAsString(dto);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void create_Returns201_AndInvokesService() throws Exception {
        Mockito.when(projectService.createProject(any(ProjectDto.class)))
                .thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(post("/api/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson()))
                .andExpect(status().isCreated());

        Mockito.verify(projectService, times(1)).createProject(any(ProjectDto.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void update_Returns200_AndInvokesService() throws Exception {
        UUID id = UUID.randomUUID();
        Mockito.when(projectService.updateProject(eq(id), any(ProjectDto.class)))
                .thenAnswer(i -> i.getArgument(1));

        mockMvc.perform(put("/api/admin/projects/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(projectJson()))
                .andExpect(status().isOk());

        Mockito.verify(projectService, times(1)).updateProject(eq(id), any(ProjectDto.class));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void delete_Returns204_AndInvokesService() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/admin/projects/" + id))
                .andExpect(status().isNoContent());

        Mockito.verify(projectService, times(1)).deleteProject(eq(id));
    }
}

