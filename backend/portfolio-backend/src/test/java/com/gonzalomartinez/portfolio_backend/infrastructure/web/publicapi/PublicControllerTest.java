package com.gonzalomartinez.portfolio_backend.infrastructure.web.publicapi;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalomartinez.portfolio_backend.application.dto.SkillDto;
import com.gonzalomartinez.portfolio_backend.application.service.ExperienceService;
import com.gonzalomartinez.portfolio_backend.application.service.ProjectService;
import com.gonzalomartinez.portfolio_backend.application.service.SkillService;
import com.gonzalomartinez.portfolio_backend.application.service.ProfileService;
import com.gonzalomartinez.portfolio_backend.application.service.SpokenLanguageService;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = true)
class PublicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean private SkillService skillService;
    @MockBean private ExperienceService experienceService;
    @MockBean private ProjectService projectService;
    @MockBean private ProfileService profileService;
    @MockBean private SpokenLanguageService spokenLanguageService;

    @Test
    void getSkills_Returns200() throws Exception {
        Mockito.when(skillService.getAllSkills()).thenReturn(Collections.<SkillDto>emptyList());

        mockMvc.perform(get("/api/public/skills")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(skillService, times(1)).getAllSkills();
    }

    @Test
    void getProfile_Returns200() throws Exception {
        Mockito.when(profileService.getProfile()).thenReturn(Profile.builder().titleEn("t").titleEs("t").build());

        mockMvc.perform(get("/api/public/profile")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(profileService, times(1)).getProfile();
    }

    @Test
    void getProfile_Returns404_WhenServiceThrowsNotFound() throws Exception {
        Mockito.when(profileService.getProfile()).thenThrow(new ResourceNotFoundException("Profile not found"));

        mockMvc.perform(get("/api/public/profile")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}

