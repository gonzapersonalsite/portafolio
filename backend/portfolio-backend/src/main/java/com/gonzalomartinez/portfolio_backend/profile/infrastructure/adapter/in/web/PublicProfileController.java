package com.gonzalomartinez.portfolio_backend.profile.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.profile.application.ProfileDto;
import com.gonzalomartinez.portfolio_backend.profile.application.GetProfileUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/profile")
public class PublicProfileController {

    private final GetProfileUseCase getProfileUseCase;

    public PublicProfileController(GetProfileUseCase getProfileUseCase) {
        this.getProfileUseCase = getProfileUseCase;
    }

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok(getProfileUseCase.getProfile());
    }
}
