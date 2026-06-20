package com.gonzalomartinez.portfolio_backend.skill.infrastructure.adapter.out.persistence;

import com.gonzalomartinez.portfolio_backend.skill.domain.Skill;
import com.gonzalomartinez.portfolio_backend.skill.domain.SkillRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class SkillRepositoryAdapter implements SkillRepositoryPort {

    private final JpaSkillRepository jpaSkillRepository;

    public SkillRepositoryAdapter(JpaSkillRepository jpaSkillRepository) {
        this.jpaSkillRepository = jpaSkillRepository;
    }

    @Override
    public List<Skill> findAllByOrderByOrderAsc() {
        return jpaSkillRepository.findAllByOrderByOrderAsc()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Skill> findAll() {
        return jpaSkillRepository.findAll()
                .stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Skill> findById(UUID id) {
        return jpaSkillRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Skill save(Skill skill) {
        SkillEntity entity = toEntity(skill);
        SkillEntity savedEntity = jpaSkillRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        jpaSkillRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaSkillRepository.existsById(id);
    }

    private Skill toDomain(SkillEntity entity) {
        return new Skill(
                entity.getId(),
                entity.getNameEn(),
                entity.getNameEs(),
                entity.getLevel(),
                entity.getCategory(),
                entity.getIconUrl(),
                entity.getOrder()
        );
    }

    private SkillEntity toEntity(Skill domain) {
        return new SkillEntity(
                domain.id(),
                domain.nameEn(),
                domain.nameEs(),
                domain.level(),
                domain.category(),
                domain.iconUrl(),
                domain.order()
        );
    }
}
