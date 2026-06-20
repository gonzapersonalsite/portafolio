package com.gonzalomartinez.portfolio_backend.project.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.project.domain.Project;
import com.gonzalomartinez.portfolio_backend.project.domain.ProjectRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProjectRepositoryAdapter implements ProjectRepositoryPort {

    private final JpaProjectRepository jpaProjectRepository;

    public ProjectRepositoryAdapter(JpaProjectRepository jpaProjectRepository) {
        this.jpaProjectRepository = jpaProjectRepository;
    }

    @Override
    public List<Project> findAllByOrderByOrderAsc() {
        return jpaProjectRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Project> findByFeaturedTrueOrderByOrderAsc() {
        return jpaProjectRepository.findByFeaturedTrueOrderByOrderAsc()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Project> findById(UUID id) {
        return jpaProjectRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Project save(Project project) {
        ProjectEntity entity = toEntity(project);
        ProjectEntity savedEntity = jpaProjectRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jpaProjectRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaProjectRepository.existsById(id);
    }

    @Override
    public Integer findMaxOrder() {
        return jpaProjectRepository.findMaxOrder();
    }

    private Project toDomain(ProjectEntity entity) {
        return new Project(
                entity.getId(),
                entity.getTitleEn(),
                entity.getTitleEs(),
                entity.getDescriptionEn(),
                entity.getDescriptionEs(),
                entity.getImageUrls() != null ? entity.getImageUrls() : List.of(),
                entity.getTechnologies() != null ? entity.getTechnologies() : List.of(),
                entity.getGithubUrl(),
                entity.getLiveUrl(),
                entity.getType(),
                entity.getFeatured(),
                entity.getOrder(),
                entity.getCreatedAt()
        );
    }

    private ProjectEntity toEntity(Project domain) {
        return new ProjectEntity(
                domain.id(),
                domain.titleEn(),
                domain.titleEs(),
                domain.descriptionEn(),
                domain.descriptionEs(),
                domain.imageUrls() != null ? domain.imageUrls() : List.of(),
                domain.technologies() != null ? domain.technologies() : List.of(),
                domain.githubUrl(),
                domain.liveUrl(),
                domain.type(),
                domain.featured(),
                domain.order(),
                domain.createdAt()
        );
    }
}
