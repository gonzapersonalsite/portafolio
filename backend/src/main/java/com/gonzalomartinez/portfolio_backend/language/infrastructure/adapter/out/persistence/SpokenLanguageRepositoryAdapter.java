package com.gonzalomartinez.portfolio_backend.language.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguage;
import com.gonzalomartinez.portfolio_backend.language.domain.SpokenLanguageRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class SpokenLanguageRepositoryAdapter implements SpokenLanguageRepositoryPort {

    private final JpaSpokenLanguageRepository jpaRepository;

    public SpokenLanguageRepositoryAdapter(JpaSpokenLanguageRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<SpokenLanguage> findAllByOrderByOrderAsc() {
        return jpaRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpokenLanguage> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SpokenLanguage> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public SpokenLanguage save(SpokenLanguage language) {
        SpokenLanguageEntity entity = toEntity(language);
        SpokenLanguageEntity savedEntity = jpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }

    private SpokenLanguage toDomain(SpokenLanguageEntity entity) {
        return new SpokenLanguage(
                entity.getId(),
                entity.getNameEn(),
                entity.getNameEs(),
                entity.getLevelEn(),
                entity.getLevelEs(),
                entity.getProficiency(),
                entity.getOrder()
        );
    }

    private SpokenLanguageEntity toEntity(SpokenLanguage domain) {
        return new SpokenLanguageEntity(
                domain.id(),
                domain.nameEn(),
                domain.nameEs(),
                domain.levelEn(),
                domain.levelEs(),
                domain.proficiency(),
                domain.order()
        );
    }
}
