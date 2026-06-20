package com.gonzalomartinez.portfolio_backend.language.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaSpokenLanguageRepository extends JpaRepository<SpokenLanguageEntity, UUID> {
    List<SpokenLanguageEntity> findAllByOrderByOrderAsc();

    @Query("SELECT MAX(s.order) FROM SpokenLanguageEntity s")
    Integer findMaxOrder();
}
