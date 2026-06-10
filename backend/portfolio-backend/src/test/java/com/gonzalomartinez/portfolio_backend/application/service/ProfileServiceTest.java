package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ProfileDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import com.gonzalomartinez.portfolio_backend.domain.repository.ProfileRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private InputSanitizer inputSanitizer;

    @InjectMocks
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getProfile_WhenExists_ReturnsDto() {
        Profile profile = Profile.builder()
                .id(UUID.randomUUID())
                .fullNameEn("Gonzalo")
                .fullNameEs("Gonzalo")
                .greetingEn("Hello")
                .greetingEs("Hola")
                .build();
        when(profileRepository.findAll()).thenReturn(List.of(profile));

        ProfileDto result = profileService.getProfile();

        assertNotNull(result);
        assertEquals("Gonzalo", result.getFullNameEn());
    }

    @Test
    void getProfile_WhenEmpty_ThrowsException() {
        when(profileRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class,
                () -> profileService.getProfile());
        verify(profileRepository, never()).save(any());
    }

    @Test
    void updateProfile_SavesAndReturnsDto() {
        Profile existing = Profile.builder()
                .id(UUID.randomUUID())
                .fullNameEn("Old")
                .build();
        when(profileRepository.findAll()).thenReturn(List.of(existing));
        when(profileRepository.save(any(Profile.class))).thenReturn(existing);

        ProfileDto updateDto = ProfileDto.builder()
                .fullNameEn("Gonzalo")
                .fullNameEs("Gonzalo")
                .build();

        ProfileDto result = profileService.updateProfile(updateDto);

        assertNotNull(result);
        verify(profileRepository).save(any(Profile.class));
    }
}
