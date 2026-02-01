package com.gonzalomartinez.portfolio_backend.infrastructure.config;

import com.gonzalomartinez.portfolio_backend.domain.model.*;
import com.gonzalomartinez.portfolio_backend.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
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
    
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

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
                .username(adminUsername)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .role("ADMIN")
                .build();
        
        userRepository.save(admin);
        log.info("Created admin user - username: {}", adminUsername);
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
                .subtitleEn("Junior Full Stack Developer")
                .subtitleEs("Desarrollador Full Stack junior")
                .descriptionEn("Junior Full Stack Developer. I learn quickly, adapt to new technologies, and enjoy creating useful, maintainable web solutions.")
                .descriptionEs("Desarrollador Full Stack junior. Aprendo rápido, me adapto a nuevas tecnologías y disfruto creando soluciones web útiles y mantenibles.")
                
                // About Section
                .aboutTitleEn("Junior Full Stack Developer")
                .aboutTitleEs("Desarrollador Full Stack junior")
                .aboutIntroTitleEn("Versatile profile with a systems background and a focus on web development.")
                .aboutIntroTitleEs("Perfil versátil con base en sistemas y enfoque en desarrollo web.")
                .aboutSummaryEn("My journey started with a strong interest in understanding how systems work, which led me to complete a diploma in Microcomputer Systems and Networks. Later, I specialized in Web Application Development and discovered that what I enjoy most is building complete applications, from the front end to the back end.\nI am now looking for my first opportunity as a junior Full Stack developer, open to learning new technologies, adding value to the team, and growing step by step in frontend, backend, or full stack roles.")
                .aboutSummaryEs("Mi trayectoria empezó con un fuerte interés por entender cómo funcionan los sistemas, lo que me llevó a completar un grado en Sistemas Microinformáticos y Redes. Después me especialicé en Desarrollo de Aplicaciones Web y descubrí que lo que más disfruto es construir aplicaciones completas, desde el front‑end hasta el back‑end.\nHoy busco mi primera oportunidad como desarrollador Full Stack junior, abierto a aprender nuevas tecnologías, aportar valor al equipo y crecer paso a paso, ya sea en roles de frontend, backend o full stack.")
                .aboutPhilosophyEn("I like writing clear code, understanding the reasons behind things, and leaving every project slightly better than I found it. I prefer simple solutions, honest feedback, and teams where you can learn out loud without being afraid of making mistakes.")
                .aboutPhilosophyEs("Me gusta escribir código claro, entender el porqué de las cosas y dejar cada proyecto un poco mejor de lo que estaba. Prefiero soluciones sencillas, feedback honesto y equipos donde se pueda aprender en voz alta sin miedo a equivocarse.")
                .sentenceEn("I’m the kind of person who checks twice if the fridge is properly closed; I like making sure everything is in place before I call something done.")
                .sentenceEs("Soy la persona que revisa dos veces si ha cerrado bien la nevera; me gusta asegurarme de que todo queda en su sitio antes de dar algo por terminado.")
                
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
                .imageUrl("https://i.postimg.cc/mgDv4QzJ/foto_carnet_original.jpg")
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
