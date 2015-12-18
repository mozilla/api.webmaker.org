BEGIN;

ALTER TABLE projects
ADD COLUMN metadata jsonb DEFAULT '{"tags":[]}'::jsonb;

CREATE INDEX ON projects USING gin ((metadata -> 'tags'));

COMMIT;
