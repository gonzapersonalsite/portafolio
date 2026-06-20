package com.gonzalomartinez.portfolio_backend.profile.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.profile.domain.Profile;
import com.gonzalomartinez.portfolio_backend.profile.domain.ProfileRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProfileRepositoryAdapter implements ProfileRepositoryPort {

    private final JpaProfileRepository jpaProfileRepository;

    public ProfileRepositoryAdapter(JpaProfileRepository jpaProfileRepository) {
        this.jpaProfileRepository = jpaProfileRepository;
    }

    @Override
    public List<Profile> findAll() {
        return jpaProfileRepository.findAll()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Profile save(Profile profile) {
        ProfileEntity entity = toEntity(profile);
        ProfileEntity savedEntity = jpaProfileRepository.save(entity);
        return toDomain(savedEntity);
    }

    private Profile toDomain(ProfileEntity entity) {
        return new Profile(
                entity.getId(),
                entity.getGreetingEn(),
                entity.getGreetingEs(),
                entity.getTitleEn(),
                entity.getTitleEs(),
                entity.getSubtitleEn(),
                entity.getSubtitleEs(),
                entity.getDescriptionEn(),
                entity.getDescriptionEs(),
                entity.getAboutTitleEn(),
                entity.getAboutTitleEs(),
                entity.getAboutIntroTitleEn(),
                entity.getAboutIntroTitleEs(),
                entity.getAboutSummaryEn(),
                entity.getAboutSummaryEs(),
                entity.getAboutPhilosophyEn(),
                entity.getAboutPhilosophyEs(),
                entity.getSentenceEn(),
                entity.getSentenceEs(),
                entity.getCvUrl(),
                entity.getFullNameEn(),
                entity.getFullNameEs(),
                entity.getEmail(),
                entity.getGithubUrl(),
                entity.getLinkedinUrl(),
                entity.getLocationEn(),
                entity.getLocationEs(),
                entity.getLogoText(),
                entity.getImageUrl()
        );
    }

    private ProfileEntity toEntity(Profile domain) {
        return new ProfileEntity(
                domain.id(),
                domain.greetingEn(),
                domain.greetingEs(),
                domain.titleEn(),
                domain.titleEs(),
                domain.subtitleEn(),
                domain.subtitleEs(),
                domain.descriptionEn(),
                domain.descriptionEs(),
                domain.aboutTitleEn(),
                domain.aboutTitleEs(),
                domain.aboutIntroTitleEn(),
                domain.aboutIntroTitleEs(),
                domain.aboutSummaryEn(),
                domain.aboutSummaryEs(),
                domain.aboutPhilosophyEn(),
                domain.aboutPhilosophyEs(),
                domain.sentenceEn(),
                domain.sentenceEs(),
                domain.cvUrl(),
                domain.fullNameEn(),
                domain.fullNameEs(),
                domain.email(),
                domain.githubUrl(),
                domain.linkedinUrl(),
                domain.locationEn(),
                domain.locationEs(),
                domain.logoText(),
                domain.imageUrl()
        );
    }
}
