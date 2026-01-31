package com.gonzalomartinez.portfolio_backend.infrastructure.config;

import com.gonzalomartinez.portfolio_backend.domain.model.*;
import com.gonzalomartinez.portfolio_backend.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("!prod")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileRepository profileRepository;
    private final SpokenLanguageRepository spokenLanguageRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        
        if (skillRepository.count() == 0) {
            seedSkills();
        }
        
        if (experienceRepository.count() == 0) {
            seedExperiences();
        }
        
        if (projectRepository.count() == 0) {
            seedProjects();
        }

        if (profileRepository.count() == 0) {
            seedProfile();
        }

        if (spokenLanguageRepository.count() == 0) {
            seedSpokenLanguages();
        }
        
        log.info("Database seeding completed");
    }
    
    private void seedUsers() {
        User admin = User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .build();
        
        userRepository.save(admin);
        log.info("Created admin user - username: admin, password: admin123");
    }
    
    private void seedSkills() {
        log.info("Skill seeding skipped");
    }
    
    private void seedExperiences() {
        log.info("Experience seeding skipped");
    }
    
    private void seedProjects() {
        log.info("Project seeding skipped");
    }

    private void seedProfile() {
        com.gonzalomartinez.portfolio_backend.domain.model.Profile profile = com.gonzalomartinez.portfolio_backend.domain.model.Profile.builder()
                // Home Section
                .greetingEn("HELLO WORLD")
                .greetingEs("HOLA MUNDO")
                .titleEn("Professional Portfolio")
                .titleEs("Portfolio Profesional")
                .subtitleEn("Full Stack Developer")
                .subtitleEs("Desarrollador Full Stack")
                .descriptionEn("I build exceptional digital experiences that are fast, accessible, responsive, and visually appealing. Specialized in React and Spring Boot.")
                .descriptionEs("Construyo experiencias digitales excepcionales: rápidas, accesibles, adaptables y visualmente atractivas. Especializado en React y Spring Boot.")
                
                // About Section
                .aboutTitleEn("Passionate about developing scalable and maintainable applications")
                .aboutTitleEs("Apasionado por desarrollar aplicaciones escalables y mantenibles")
                .aboutIntroTitleEn("Web Application Developer based in Palma de Mallorca, Spain")
                .aboutIntroTitleEs("Desarrollador de Aplicaciones Web en Palma de Mallorca, España")
                .aboutSummaryEn("My journey began with a strong interest in how systems work, leading me to complete a degree in Microcomputer Systems and Networks. This gave me a solid foundation in hardware, Linux/Windows administration, and networking. I then specialized in software, obtaining a Higher Degree in Web Application Development.")
                .aboutSummaryEs("Mi trayectoria comenzó con un fuerte interés en cómo funcionan los sistemas, lo que me llevó a completar el Grado Técnico en Sistemas Microinformáticos y Redes. Esto me dio una base sólida en hardware, administración Linux/Windows y redes. Luego me especialicé en software, obteniendo el Grado Superior en Desarrollo de Aplicaciones Web.")
                .aboutPhilosophyEn("During my training and internships, I have worked with Java Spring Boot, React, and Vue in microservices environments. I combine my systems background with modern development skills to build robust, maintainable solutions.")
                .aboutPhilosophyEs("Durante mi formación y prácticas, he trabajado con Java Spring Boot, React y Vue en entornos de microservicios. Combino mi experiencia en sistemas con habilidades modernas de desarrollo para construir soluciones robustas y mantenibles.")
                
                // CV
                .cvUrl("https://drive.google.com/uc?export=download&id=1Xm8xf5GpKLoDaZqA9jBE9CDXNHLJrGtG")
                // Personal / Social
                .fullNameEn("Gonzalo Martinez")
                .fullNameEs("Gonzalo Martinez")
                .email("gonzalomartinezg2001@gmail.com")
                .githubUrl("https://github.com/gonzapersonalsite")
                .linkedinUrl("http://www.linkedin.com/in/gonzalo-martinez-garcia-353507370")
                .locationEn("Palma de Mallorca, Spain")
                .locationEs("Palma de Mallorca, España")
                .logoText("GONZALO.DEV")
                .imageUrl("https://images.unsplash.com/photo-1544717305-2782549b5136?ixid=M3w1MjM0fDB8MXxzZWFyY2h8NHx8ZGV2ZWxvcGVyJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzA2Njc0NTAyfDA&ixlib=rb-4.0.3&q=80&w=1000")
                .build();

        profileRepository.save(profile);
        log.info("Created initial profile data");
    }

    private void seedSpokenLanguages() {
        List<SpokenLanguage> languages = Arrays.asList(
                SpokenLanguage.builder()
                        .nameEn("Spanish")
                        .nameEs("Español")
                        .levelEn("Native")
                        .levelEs("Nativo")
                        .proficiency(100)
                        .order(1)
                        .build(),
                SpokenLanguage.builder()
                        .nameEn("Catalan")
                        .nameEs("Catalán")
                        .levelEn("Intermediate")
                        .levelEs("Intermedio")
                        .proficiency(75)
                        .order(2)
                        .build(),
                SpokenLanguage.builder()
                        .nameEn("English")
                        .nameEs("Inglés")
                        .levelEn("Basic")
                        .levelEs("Básico")
                        .proficiency(30)
                        .order(3)
                        .build()
        );

        spokenLanguageRepository.saveAll(languages);
        log.info("Created {} spoken languages", languages.size());
    }
}
