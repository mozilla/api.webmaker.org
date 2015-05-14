/* Table Creation */
CREATE TABLE IF NOT EXISTS "users"
(
  id bigserial NOT NULL,
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

CREATE TABLE IF NOT EXISTS "projects"
(
  id bigserial NOT NULL,
  user_id bigint REFERENCES users(id),
  remixed_from bigint DEFAULT NULL,
  version varchar NOT NULL,
  title varchar NOT NULL,
  featured boolean NOT NULL DEFAULT FALSE,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp DEFAULT NULL,
  thumbnail jsonb NOT NULL DEFAULT '{}'::JSONB,
  CONSTRAINT projects_id_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "pages"
(
  id bigserial NOT NULL,
  project_id bigint REFERENCES projects(id),
  x integer NOT NULL,
  y integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp DEFAULT NULL,
  styles jsonb NOT NULL DEFAULT '{}'::JSONB,
  CONSTRAINT pages_id_pk PRIMARY KEY (id),
  UNIQUE (project_id, x, y)
);

CREATE TABLE IF NOT EXISTS "elements"
(
  id bigserial NOT NULL,
  type varchar NOT NULL,
  page_id bigint REFERENCES pages(id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at timestamp DEFAULT NULL,
  attributes jsonb NOT NULL DEFAULT '{}'::JSONB,
  styles jsonb NOT NULL DEFAULT '{}'::JSONB,
  CONSTRAINT elements_id_pk PRIMARY KEY (id)
);

/* Indexes */
CREATE INDEX user_idx_id_deleted_at ON users (id, deleted_at);
CREATE INDEX project_deleted_at_user_id on projects (deleted_at, user_id);
CREATE INDEX deleted_at_remixed_from_idx on projects (deleted_at, remixed_from);
CREATE INDEX deleted_at_featured_idx on projects (deleted_at, featured);
CREATE INDEX project_id_deleted_at_idx ON pages (project_id, deleted_at);
CREATE INDEX deleted_at_page_id_idx ON elements (deleted_at, page_id);

/* Triggers */
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_page_updated_at BEFORE UPDATE ON pages
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_element_updated_at BEFORE UPDATE ON elements
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
