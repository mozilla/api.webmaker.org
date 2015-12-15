BEGIN;

CREATE TABLE IF NOT EXISTS project_views
(
  project_id bigint REFERENCES projects(id),
  view_count bigint NOT NULL DEFAULT 0
);

CREATE INDEX project_views_idx ON project_views (project_id);

COMMIT;
