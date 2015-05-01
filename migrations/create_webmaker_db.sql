CREATE TABLE IF NOT EXISTS "users"
(
  id serial NOT NULL,
  username varchar NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp DEFAULT NULL,
  language varchar NOT NULL DEFAULT 'en',
  country varchar NOT NULL DEFAULT 'US',
  moderator boolean NOT NULL DEFAULT FALSE,
  staff boolean NOT NULL DEFAULT FALSE,
  CONSTRAINT users_id_pk PRIMARY KEY (id),
  CONSTRAINT unique_username UNIQUE (username)
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
