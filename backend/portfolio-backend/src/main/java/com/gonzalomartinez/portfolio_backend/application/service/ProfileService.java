package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.application.dto.ProfileDto;
import com.gonzalomartinez.portfolio_backend.domain.exception.ResourceNotFoundException;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import com.gonzalomartinez.portfolio_backend.domain.repository.ProfileRepository;
import com.gonzalomartinez.portfolio_backend.infrastructure.security.InputSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final InputSanitizer inputSanitizer;

    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        List<Profile> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            throw new ResourceNotFoundException("Profile", "id", "any");
        }
        return convertToDto(profiles.get(0));
    }

    @Transactional
    public ProfileDto updateProfile(ProfileDto profileDetails) {
        List<Profile> profiles = profileRepository.findAll();
        Profile profile = profiles.isEmpty() ? new Profile() : profiles.get(0);

        // Home
        profile.setGreetingEn(inputSanitizer.sanitize(profileDetails.getGreetingEn()));
        profile.setGreetingEs(inputSanitizer.sanitize(profileDetails.getGreetingEs()));
        profile.setTitleEn(inputSanitizer.sanitize(profileDetails.getTitleEn()));
        profile.setTitleEs(inputSanitizer.sanitize(profileDetails.getTitleEs()));
        profile.setSubtitleEn(inputSanitizer.sanitize(profileDetails.getSubtitleEn()));
        profile.setSubtitleEs(inputSanitizer.sanitize(profileDetails.getSubtitleEs()));
        profile.setDescriptionEn(inputSanitizer.sanitize(profileDetails.getDescriptionEn()));
        profile.setDescriptionEs(inputSanitizer.sanitize(profileDetails.getDescriptionEs()));

        // About
        profile.setAboutTitleEn(inputSanitizer.sanitize(profileDetails.getAboutTitleEn()));
        profile.setAboutTitleEs(inputSanitizer.sanitize(profileDetails.getAboutTitleEs()));
        profile.setAboutIntroTitleEn(inputSanitizer.sanitize(profileDetails.getAboutIntroTitleEn()));
        profile.setAboutIntroTitleEs(inputSanitizer.sanitize(profileDetails.getAboutIntroTitleEs()));
        profile.setAboutSummaryEn(inputSanitizer.sanitize(profileDetails.getAboutSummaryEn()));
        profile.setAboutSummaryEs(inputSanitizer.sanitize(profileDetails.getAboutSummaryEs()));
        profile.setAboutPhilosophyEn(inputSanitizer.sanitize(profileDetails.getAboutPhilosophyEn()));
        profile.setAboutPhilosophyEs(inputSanitizer.sanitize(profileDetails.getAboutPhilosophyEs()));
        profile.setSentenceEn(inputSanitizer.sanitize(profileDetails.getSentenceEn()));
        profile.setSentenceEs(inputSanitizer.sanitize(profileDetails.getSentenceEs()));
        
        // General
        if (profileDetails.getCvUrl() != null) {
            profile.setCvUrl(inputSanitizer.sanitizeUrl(profileDetails.getCvUrl()));
        }

        // Personal / Social
        profile.setFullNameEn(inputSanitizer.sanitize(profileDetails.getFullNameEn()));
        profile.setFullNameEs(inputSanitizer.sanitize(profileDetails.getFullNameEs()));
        profile.setEmail(inputSanitizer.sanitize(profileDetails.getEmail()));
        profile.setGithubUrl(inputSanitizer.sanitizeUrl(profileDetails.getGithubUrl()));
        profile.setLinkedinUrl(inputSanitizer.sanitizeUrl(profileDetails.getLinkedinUrl()));
        profile.setLocationEn(inputSanitizer.sanitize(profileDetails.getLocationEn()));
        profile.setLocationEs(inputSanitizer.sanitize(profileDetails.getLocationEs()));
        profile.setLogoText(inputSanitizer.sanitize(profileDetails.getLogoText()));
        profile.setImageUrl(inputSanitizer.sanitizeUrl(profileDetails.getImageUrl()));

        return convertToDto(profileRepository.save(profile));
    }
    
    private ProfileDto convertToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .greetingEn(profile.getGreetingEn())
                .greetingEs(profile.getGreetingEs())
                .titleEn(profile.getTitleEn())
                .titleEs(profile.getTitleEs())
                .subtitleEn(profile.getSubtitleEn())
                .subtitleEs(profile.getSubtitleEs())
                .descriptionEn(profile.getDescriptionEn())
                .descriptionEs(profile.getDescriptionEs())
                .aboutTitleEn(profile.getAboutTitleEn())
                .aboutTitleEs(profile.getAboutTitleEs())
                .aboutIntroTitleEn(profile.getAboutIntroTitleEn())
                .aboutIntroTitleEs(profile.getAboutIntroTitleEs())
                .aboutSummaryEn(profile.getAboutSummaryEn())
                .aboutSummaryEs(profile.getAboutSummaryEs())
                .aboutPhilosophyEn(profile.getAboutPhilosophyEn())
                .aboutPhilosophyEs(profile.getAboutPhilosophyEs())
                .sentenceEn(profile.getSentenceEn())
                .sentenceEs(profile.getSentenceEs())
                .cvUrl(profile.getCvUrl())
                .fullNameEn(profile.getFullNameEn())
                .fullNameEs(profile.getFullNameEs())
                .email(profile.getEmail())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .locationEn(profile.getLocationEn())
                .locationEs(profile.getLocationEs())
                .logoText(profile.getLogoText())
                .imageUrl(profile.getImageUrl())
                .build();
    }
}
