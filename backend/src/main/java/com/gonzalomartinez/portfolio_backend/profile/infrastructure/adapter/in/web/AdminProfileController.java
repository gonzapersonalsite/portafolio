package com.gonzalomartinez.portfolio_backend.profile.infrastructure.adapter.in.web;

import com.gonzalomartinez.portfolio_backend.profile.application.ProfileDto;
import com.gonzalomartinez.portfolio_backend.profile.application.GetProfileUseCase;
import com.gonzalomartinez.portfolio_backend.profile.application.UpdateProfileUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
public class AdminProfileController {

    private final GetProfileUseCase getProfileUseCase;
    private final UpdateProfileUseCase updateProfileUseCase;

    public AdminProfileController(GetProfileUseCase getProfileUseCase, UpdateProfileUseCase updateProfileUseCase) {
        this.getProfileUseCase = getProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
    }

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {
        return ResponseEntity.ok(getProfileUseCase.getProfile());
    }

    @PutMapping
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto profile) {
        return ResponseEntity.ok(updateProfileUseCase.updateProfile(profile));
    }
}
