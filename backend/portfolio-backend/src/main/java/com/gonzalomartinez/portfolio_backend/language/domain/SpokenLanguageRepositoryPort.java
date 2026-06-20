package com.gonzalomartinez.portfolio_backend.language.domain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpokenLanguageRepositoryPort {
    List<SpokenLanguage> findAllByOrderByOrderAsc();
    List<SpokenLanguage> findAll();
    Optional<SpokenLanguage> findById(UUID id);
    SpokenLanguage save(SpokenLanguage language);
    void deleteById(UUID id);
    boolean existsById(UUID id);
}
