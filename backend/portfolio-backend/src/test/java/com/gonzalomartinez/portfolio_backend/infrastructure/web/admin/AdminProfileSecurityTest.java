package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalomartinez.portfolio_backend.application.service.ProfileService;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = true)
class AdminProfileSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

    private String minimalProfileJson() throws Exception {
        Profile p = Profile.builder().titleEn("Title").titleEs("Título").build();
        return objectMapper.writeValueAsString(p);
    }

    @Test
    @DisplayName("Update profile returns 401 when unauthenticated")
    void updateProfile_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(put("/api/admin/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(minimalProfileJson()))
                .andExpect(status().isUnauthorized());

        Mockito.verifyNoInteractions(profileService);
    }

    @Test
    @DisplayName("Update profile returns 403 for non-admin authenticated user")
    @WithMockUser(username = "user", roles = {"USER"})
    void updateProfile_UserRole_Returns403() throws Exception {
        mockMvc.perform(put("/api/admin/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(minimalProfileJson()))
                .andExpect(status().isForbidden());

        Mockito.verifyNoInteractions(profileService);
    }

    @Test
    @DisplayName("Update profile succeeds (200) for ADMIN and invokes service")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void updateProfile_AdminRole_Returns200_AndInvokesService() throws Exception {
        Mockito.when(profileService.updateProfile(Mockito.any(Profile.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(put("/api/admin/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(minimalProfileJson()))
                .andExpect(status().isOk());

        Mockito.verify(profileService, Mockito.times(1)).updateProfile(Mockito.any(Profile.class));
    }
}
