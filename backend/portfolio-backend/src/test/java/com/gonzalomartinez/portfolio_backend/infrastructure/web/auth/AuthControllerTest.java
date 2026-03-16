package com.gonzalomartinez.portfolio_backend.infrastructure.web.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gonzalomartinez.portfolio_backend.application.dto.AuthResponse;
import com.gonzalomartinez.portfolio_backend.application.dto.LoginRequest;
import com.gonzalomartinez.portfolio_backend.application.service.AuthenticationService;
import com.gonzalomartinez.portfolio_backend.domain.exception.InvalidCredentialsException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc(addFilters = true)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationService authenticationService;

    @Test
    void login_Returns200_WhenCredentialsAreValid() throws Exception {
        AuthResponse response = AuthResponse.builder()
                .token("token")
                .username("admin")
                .expiresAt(LocalDateTime.now().plusHours(1))
                .build();
        Mockito.when(authenticationService.login(any(LoginRequest.class))).thenReturn(response);

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("secret");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"))
                .andExpect(jsonPath("$.username").value("admin"));
    }

    @Test
    void login_Returns401_WhenCredentialsAreInvalid() throws Exception {
        Mockito.when(authenticationService.login(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException("Invalid username or password"));

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("bad");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void validateToken_ReturnsTrue_WhenServiceValidates() throws Exception {
        Mockito.when(authenticationService.validateToken("valid")).thenReturn(true);

        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer valid"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(true));
    }

    @Test
    void validateToken_ReturnsFalse_WhenHeaderWithoutBearer() throws Exception {
        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Invalid"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(false));
    }
}
