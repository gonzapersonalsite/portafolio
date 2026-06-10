CREATE TABLE users (
    id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE profiles (
    id UUID NOT NULL,
    about_intro_title_en VARCHAR(255),
    about_intro_title_es VARCHAR(255),
    about_philosophy_en TEXT,
    about_philosophy_es TEXT,
    about_summary_en TEXT,
    about_summary_es TEXT,
    about_title_en VARCHAR(255),
    about_title_es VARCHAR(255),
    cv_url VARCHAR(255),
    description_en TEXT,
    description_es TEXT,
    email VARCHAR(100),
    full_name_en VARCHAR(100),
    full_name_es VARCHAR(100),
    github_url VARCHAR(255),
    greeting_en VARCHAR(100),
    greeting_es VARCHAR(100),
    image_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    location_en VARCHAR(100),
    location_es VARCHAR(100),
    logo_text VARCHAR(255),
    subtitle_en VARCHAR(255),
    subtitle_es VARCHAR(255),
    title_en VARCHAR(255),
    title_es VARCHAR(255),
    sentence_en TEXT,
    sentence_es TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE skills (
    id UUID NOT NULL,
    category VARCHAR(50),
    icon_url VARCHAR(255),
    level INTEGER NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    display_order INTEGER,
    PRIMARY KEY (id),
    CONSTRAINT skills_level_check CHECK (((level >= 0) AND (level <= 100)))
);

CREATE TABLE spoken_languages (
    id UUID NOT NULL,
    level_en VARCHAR(100) NOT NULL,
    level_es VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    display_order INTEGER,
    proficiency INTEGER NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT spoken_languages_proficiency_check CHECK (((proficiency <= 100) AND (proficiency >= 0)))
);

CREATE TABLE experiences (
    id UUID NOT NULL,
    company_en VARCHAR(150) NOT NULL,
    company_es VARCHAR(150) NOT NULL,
    description_en TEXT,
    description_es TEXT,
    end_date DATE,
    display_order INTEGER,
    position_en VARCHAR(150) NOT NULL,
    position_es VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE experience_technologies (
    experience_id UUID NOT NULL,
    technology VARCHAR(255),
    PRIMARY KEY (experience_id, technology),
    CONSTRAINT fk_experience_technologies_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

CREATE TABLE projects (
    id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    description_en TEXT,
    description_es TEXT,
    featured BOOLEAN NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    display_order INTEGER,
    title_en VARCHAR(200) NOT NULL,
    title_es VARCHAR(200) NOT NULL,
    type VARCHAR(20),
    PRIMARY KEY (id),
    CONSTRAINT projects_type_check CHECK (((type)::TEXT = ANY (ARRAY[('WEB'::CHARACTER VARYING)::TEXT, ('DESKTOP'::CHARACTER VARYING)::TEXT, ('MOBILE'::CHARACTER VARYING)::TEXT, ('OTHER'::CHARACTER VARYING)::TEXT])))
);

CREATE TABLE project_images (
    project_id UUID NOT NULL,
    image_url VARCHAR(500),
    image_order INTEGER NOT NULL,
    PRIMARY KEY (project_id, image_order),
    CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE project_technologies (
    project_id UUID NOT NULL,
    technology VARCHAR(255),
    PRIMARY KEY (project_id, technology),
    CONSTRAINT fk_project_technologies_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
