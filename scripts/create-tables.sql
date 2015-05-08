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
CREATE INDEX project_id_user_id_deleted_at ON projects (id, user_id, deleted_at);
CREATE INDEX project_id_deleted_at ON pages (project_id, deleted_at);
CREATE INDEX pages_id_x_y_deleted_at ON pages (id, x, y, deleted_at);
CREATE INDEX elements_page_is_deleted_at ON elements (id, page_id, deleted_at);

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
