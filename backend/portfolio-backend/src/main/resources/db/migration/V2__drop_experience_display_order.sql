-- Drop orphan column after removing display_order from Experience entity.
-- Applied automatically by Flyway on next deploy.
ALTER TABLE experiences DROP COLUMN IF EXISTS display_order;
