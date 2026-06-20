package com.gonzalomartinez.portfolio_backend.profile.application;

import com.gonzalomartinez.portfolio_backend.shared.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.profile.domain.Profile;
import com.gonzalomartinez.portfolio_backend.profile.domain.ProfileRepositoryPort;
import com.gonzalomartinez.portfolio_backend.shared.application.SanitizerPort;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProfileUseCaseService implements GetProfileUseCase, UpdateProfileUseCase {

    private final ProfileRepositoryPort profileRepository;
    private final SanitizerPort inputSanitizer;

    public ProfileUseCaseService(ProfileRepositoryPort profileRepository, SanitizerPort inputSanitizer) {
        this.profileRepository = profileRepository;
        this.inputSanitizer = inputSanitizer;
    }

    @Override
    public ProfileDto getProfile() {
        Profile profile = profileRepository.findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", "any"));
        return convertToDto(profile);
    }

    @Override
    @Transactional
    public ProfileDto updateProfile(ProfileDto profileDetails) {
        Profile existingProfile = profileRepository.findFirst()
                .orElseGet(this::createEmptyProfile);

        String cvUrl = profileDetails.cvUrl() != null 
                ? inputSanitizer.sanitizeUrl(profileDetails.cvUrl()) 
                : existingProfile.cvUrl();

        Profile updatedProfile = new Profile(
                existingProfile.id(),
                inputSanitizer.sanitize(profileDetails.greetingEn()),
                inputSanitizer.sanitize(profileDetails.greetingEs()),
                inputSanitizer.sanitize(profileDetails.titleEn()),
                inputSanitizer.sanitize(profileDetails.titleEs()),
                inputSanitizer.sanitize(profileDetails.subtitleEn()),
                inputSanitizer.sanitize(profileDetails.subtitleEs()),
                inputSanitizer.sanitize(profileDetails.descriptionEn()),
                inputSanitizer.sanitize(profileDetails.descriptionEs()),
                inputSanitizer.sanitize(profileDetails.aboutTitleEn()),
                inputSanitizer.sanitize(profileDetails.aboutTitleEs()),
                inputSanitizer.sanitize(profileDetails.aboutIntroTitleEn()),
                inputSanitizer.sanitize(profileDetails.aboutIntroTitleEs()),
                inputSanitizer.sanitize(profileDetails.aboutSummaryEn()),
                inputSanitizer.sanitize(profileDetails.aboutSummaryEs()),
                inputSanitizer.sanitize(profileDetails.aboutPhilosophyEn()),
                inputSanitizer.sanitize(profileDetails.aboutPhilosophyEs()),
                inputSanitizer.sanitize(profileDetails.sentenceEn()),
                inputSanitizer.sanitize(profileDetails.sentenceEs()),
                cvUrl,
                inputSanitizer.sanitize(profileDetails.fullNameEn()),
                inputSanitizer.sanitize(profileDetails.fullNameEs()),
                inputSanitizer.sanitize(profileDetails.email()),
                inputSanitizer.sanitizeUrl(profileDetails.githubUrl()),
                inputSanitizer.sanitizeUrl(profileDetails.linkedinUrl()),
                inputSanitizer.sanitize(profileDetails.locationEn()),
                inputSanitizer.sanitize(profileDetails.locationEs()),
                inputSanitizer.sanitize(profileDetails.logoText()),
                inputSanitizer.sanitizeUrl(profileDetails.imageUrl())
        );

        Profile savedProfile = profileRepository.save(updatedProfile);
        return convertToDto(savedProfile);
    }

    private Profile createEmptyProfile() {
        return new Profile(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    private ProfileDto convertToDto(Profile profile) {
        return new ProfileDto(
                profile.id(),
                profile.greetingEn(),
                profile.greetingEs(),
                profile.titleEn(),
                profile.titleEs(),
                profile.subtitleEn(),
                profile.subtitleEs(),
                profile.descriptionEn(),
                profile.descriptionEs(),
                profile.aboutTitleEn(),
                profile.aboutTitleEs(),
                profile.aboutIntroTitleEn(),
                profile.aboutIntroTitleEs(),
                profile.aboutSummaryEn(),
                profile.aboutSummaryEs(),
                profile.aboutPhilosophyEn(),
                profile.aboutPhilosophyEs(),
                profile.sentenceEn(),
                profile.sentenceEs(),
                profile.cvUrl(),
                profile.fullNameEn(),
                profile.fullNameEs(),
                profile.email(),
                profile.githubUrl(),
                profile.linkedinUrl(),
                profile.locationEn(),
                profile.locationEs(),
                profile.logoText(),
                profile.imageUrl()
        );
    }
}
