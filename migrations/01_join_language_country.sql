BEGIN;

UPDATE users
SET language = concat(users.language, '-', users.country);

ALTER TABLE users
ALTER COLUMN language
SET DEFAULT 'en-US';

COMMIT;
