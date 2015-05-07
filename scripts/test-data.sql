DO $$

DECLARE
  chris_id integer;
  jon_id integer;
  andrew_id integer;
  remix_id integer;
  thumb_empty jsonb := '{}'::jsonb;
  thumb_small jsonb := '{"400": "https://example.com/400.png"}'::jsonb;
  thumb_large jsonb := '{"1024": "https://example.com/1024.png"}'::jsonb;
  thumb_all jsonb := '{"400": "https://example.com/400.png", "1024": "https://example.com/1024.png"}'::jsonb;

BEGIN

  -- create users
  INSERT INTO users (username, language, country, moderator, staff) VALUES
    ('chris_testing', 'en', 'CA', FALSE, FALSE),
    ('jon_testing', 'en', 'US', TRUE, FALSE),
    ('andrew_testing', 'en', 'GB', FALSE, TRUE);

  -- some helper functions
  CREATE OR REPLACE FUNCTION get_user_id(varchar) RETURNS integer AS
    'SELECT id FROM users WHERE username = $1;'
  LANGUAGE SQL;

  CREATE OR REPLACE FUNCTION get_project_id(varchar) RETURNS integer AS
    'SELECT id FROM projects WHERE title = $1;'
  LANGUAGE SQL;

  -- get user ids created above
  chris_id := get_user_id('chris_testing');
  jon_id := get_user_id('jon_testing');
  andrew_id := get_user_id('andrew_testing');

  -- create some test project data
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail, featured) VALUES
    (chris_id, NULL, 'test', 'test_project_1', thumb_empty, FALSE),
    (chris_id, NULL, 'test', 'test_project_2', thumb_small, TRUE),
    (jon_id, NULL, 'test', 'test_project_3', thumb_empty, FALSE),
    (jon_id, NULL, 'test', 'test_project_4', thumb_all, TRUE),
    (andrew_id, NULL, 'test', 'test_project_5', thumb_empty, FALSE),
    (andrew_id, NULL, 'test', 'test_project_6', thumb_large, TRUE);

  -- grab a project id
  remix_id := get_project_id('test_project_1');

  -- create some remixes
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail) VALUES
    (jon_id, remix_id, 'test','test_remix_1', thumb_empty),
    (andrew_id, remix_id, 'test', 'test_remix_2', thumb_empty);

END $$;
