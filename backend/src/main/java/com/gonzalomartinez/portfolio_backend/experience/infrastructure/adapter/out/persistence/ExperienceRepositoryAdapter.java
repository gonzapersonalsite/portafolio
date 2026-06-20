package com.gonzalomartinez.portfolio_backend.experience.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.experience.domain.Experience;
import com.gonzalomartinez.portfolio_backend.experience.domain.ExperienceRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ExperienceRepositoryAdapter implements ExperienceRepositoryPort {

    private final JpaExperienceRepository jpaExperienceRepository;

    public ExperienceRepositoryAdapter(JpaExperienceRepository jpaExperienceRepository) {
        this.jpaExperienceRepository = jpaExperienceRepository;
    }

    @Override
    public List<Experience> findAllByOrderByEndDateDescStartDateDesc() {
        return jpaExperienceRepository.findAllByOrderByEndDateDescStartDateDesc()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Experience> findById(UUID id) {
        return jpaExperienceRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Experience save(Experience experience) {
        ExperienceEntity entity = toEntity(experience);
        ExperienceEntity savedEntity = jpaExperienceRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jpaExperienceRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaExperienceRepository.existsById(id);
    }

    private Experience toDomain(ExperienceEntity entity) {
        return new Experience(
                entity.getId(),
                entity.getCompanyEn(),
                entity.getCompanyEs(),
                entity.getPositionEn(),
                entity.getPositionEs(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getDescriptionEn(),
                entity.getDescriptionEs(),
                entity.getTechnologies() != null ? entity.getTechnologies() : List.of()
        );
    }

    private ExperienceEntity toEntity(Experience domain) {
        return new ExperienceEntity(
                domain.id(),
                domain.companyEn(),
                domain.companyEs(),
                domain.positionEn(),
                domain.positionEs(),
                domain.startDate(),
                domain.endDate(),
                domain.descriptionEn(),
                domain.descriptionEs(),
                domain.technologies() != null ? domain.technologies() : List.of()
        );
    }
}
