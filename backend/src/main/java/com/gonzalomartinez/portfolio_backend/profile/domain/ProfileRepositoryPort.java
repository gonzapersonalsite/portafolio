package com.gonzalomartinez.portfolio_backend.profile.domain;

import java.util.List;
import java.util.Optional;

public interface ProfileRepositoryPort {
    List<Profile> findAll();
    Profile save(Profile profile);
}
