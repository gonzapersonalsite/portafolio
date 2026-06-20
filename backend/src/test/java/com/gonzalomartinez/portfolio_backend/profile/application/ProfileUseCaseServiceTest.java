package com.gonzalomartinez.portfolio_backend.profile.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.profile.domain.Profile;
import com.gonzalomartinez.portfolio_backend.profile.domain.ProfileRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
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
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class ProfileUseCaseServiceTest {

    @Mock
    private ProfileRepositoryPort profileRepository;

    @Mock
    private SanitizerPort inputSanitizer;

    @InjectMocks
    private ProfileUseCaseService profileService;

    @BeforeEach
    void setUp() {
        when(inputSanitizer.sanitize(any())).thenAnswer(i -> i.getArgument(0));
        when(inputSanitizer.sanitizeUrl(any())).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void getProfile_WhenExists_ReturnsDto() {
        Profile profile = new Profile(
                UUID.randomUUID(), "Hello", "Hola", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Gonzalo", "Gonzalo", null, null, null, null, null, null, null
        );
        when(profileRepository.findFirst()).thenReturn(Optional.of(profile));

        ProfileDto result = profileService.getProfile();

        assertNotNull(result);
        assertEquals("Gonzalo", result.fullNameEn());
    }

    @Test
    void getProfile_WhenEmpty_ThrowsException() {
        when(profileRepository.findFirst()).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> profileService.getProfile());
        verify(profileRepository, never()).save(any());
    }

    @Test
    void updateProfile_SavesAndReturnsDto() {
        Profile existing = new Profile(
                UUID.randomUUID(), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Old", null, null, null, null, null, null, null, null
        );
        when(profileRepository.findFirst()).thenReturn(Optional.of(existing));
        when(profileRepository.save(any(Profile.class))).thenReturn(existing);

        ProfileDto updateDto = new ProfileDto(
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Gonzalo", "Gonzalo", null, null, null, null, null, null, null
        );

        ProfileDto result = profileService.updateProfile(updateDto);

        assertNotNull(result);
        verify(profileRepository).save(any(Profile.class));
    }
}
