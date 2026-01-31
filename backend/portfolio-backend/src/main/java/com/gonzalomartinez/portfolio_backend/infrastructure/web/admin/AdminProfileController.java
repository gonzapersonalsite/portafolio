package com.gonzalomartinez.portfolio_backend.infrastructure.web.admin;

import com.gonzalomartinez.portfolio_backend.application.service.ProfileService;
import com.gonzalomartinez.portfolio_backend.domain.model.Profile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(profileService.updateProfile(profile));
    }
}
