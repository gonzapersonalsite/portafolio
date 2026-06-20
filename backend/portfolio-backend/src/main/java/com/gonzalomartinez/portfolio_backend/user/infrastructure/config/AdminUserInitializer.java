package com.gonzalomartinez.portfolio_backend.user.infrastructure.config;

import com.gonzalomartinez.portfolio_backend.user.domain.User;
import com.gonzalomartinez.portfolio_backend.user.domain.UserRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserInitializer.class);

    private final UserRepositoryPort userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminUserInitializer(UserRepositoryPort userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = new User(
                    null,
                    adminUsername,
                    passwordEncoder.encode(adminPassword),
                    "ADMIN",
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );
            userRepository.save(admin);
            log.info("Default admin user '{}' initialized successfully from environment variables.", adminUsername);
        }
    }
}
