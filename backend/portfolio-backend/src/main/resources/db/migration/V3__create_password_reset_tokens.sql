CREATE TABLE password_reset_tokens (
    id UUID NOT NULL,
    token VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT uk_password_reset_tokens_token UNIQUE (token)
);
