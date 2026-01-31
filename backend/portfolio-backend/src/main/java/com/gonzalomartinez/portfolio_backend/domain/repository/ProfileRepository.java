package com.gonzalomartinez.portfolio_backend.domain.repository;

import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    // Basic repository for the singleton profile
}
