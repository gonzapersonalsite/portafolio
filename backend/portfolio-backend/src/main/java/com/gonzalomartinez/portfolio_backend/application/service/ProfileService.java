package com.gonzalomartinez.portfolio_backend.application.service;

import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import com.gonzalomartinez.portfolio_backend.domain.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile getProfile() {
        List<Profile> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            return profileRepository.save(new Profile());
        }
        return profiles.get(0);
    }

    public Profile updateProfile(Profile profileDetails) {
        Profile profile = getProfile();

        // Home
        profile.setGreetingEn(profileDetails.getGreetingEn());
        profile.setGreetingEs(profileDetails.getGreetingEs());
        profile.setTitleEn(profileDetails.getTitleEn());
        profile.setTitleEs(profileDetails.getTitleEs());
        profile.setSubtitleEn(profileDetails.getSubtitleEn());
        profile.setSubtitleEs(profileDetails.getSubtitleEs());
        profile.setDescriptionEn(profileDetails.getDescriptionEn());
        profile.setDescriptionEs(profileDetails.getDescriptionEs());

        // About
        profile.setAboutTitleEn(profileDetails.getAboutTitleEn());
        profile.setAboutTitleEs(profileDetails.getAboutTitleEs());
        profile.setAboutIntroTitleEn(profileDetails.getAboutIntroTitleEn());
        profile.setAboutIntroTitleEs(profileDetails.getAboutIntroTitleEs());
        profile.setAboutSummaryEn(profileDetails.getAboutSummaryEn());
        profile.setAboutSummaryEs(profileDetails.getAboutSummaryEs());
        profile.setAboutPhilosophyEn(profileDetails.getAboutPhilosophyEn());
        profile.setAboutPhilosophyEs(profileDetails.getAboutPhilosophyEs());
        profile.setSentenceEn(profileDetails.getSentenceEn());
        profile.setSentenceEs(profileDetails.getSentenceEs());
        
        // General
        if (profileDetails.getCvUrl() != null) {
            profile.setCvUrl(profileDetails.getCvUrl());
        }

        // Personal / Social
        profile.setFullNameEn(profileDetails.getFullNameEn());
        profile.setFullNameEs(profileDetails.getFullNameEs());
        profile.setEmail(profileDetails.getEmail());
        profile.setGithubUrl(profileDetails.getGithubUrl());
        profile.setLinkedinUrl(profileDetails.getLinkedinUrl());
        profile.setLocationEn(profileDetails.getLocationEn());
        profile.setLocationEs(profileDetails.getLocationEs());
        profile.setLogoText(profileDetails.getLogoText());
        profile.setImageUrl(profileDetails.getImageUrl());

        return profileRepository.save(profile);
    }
}
