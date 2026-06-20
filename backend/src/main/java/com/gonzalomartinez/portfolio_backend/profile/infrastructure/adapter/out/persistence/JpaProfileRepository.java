package com.gonzalomartinez.portfolio_backend.profile.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JpaProfileRepository extends JpaRepository<ProfileEntity, UUID> {
}
