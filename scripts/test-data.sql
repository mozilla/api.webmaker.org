DO $$

DECLARE
  chris_id bigint;
  jon_id bigint;
  andrew_id bigint;
  project_id bigint;
  page_id bigint;
  empty_json jsonb := '{}'::jsonb;
  thumb_small jsonb := '{"400": "https://example.com/400.png"}'::jsonb;
  thumb_large jsonb := '{"1024": "https://example.com/1024.png"}'::jsonb;
  thumb_all jsonb := '{"400": "https://example.com/400.png", "1024": "https://example.com/1024.png"}'::jsonb;
  styles jsonb := '{"color": "#FF0000"}'::jsonb;
  attributes jsonb := '{"text": "test text"}'::jsonb;

BEGIN

  -- create users
  INSERT INTO users (username, language, country, moderator, staff) VALUES
    ('chris_testing', 'en', 'CA', FALSE, FALSE),
    ('jon_testing', 'en', 'US', TRUE, FALSE),
    ('andrew_testing', 'en', 'GB', FALSE, TRUE);

  -- some helper functions
  CREATE OR REPLACE FUNCTION get_user_id(varchar) RETURNS bigint AS
    'SELECT id FROM users WHERE username = $1;'
  LANGUAGE SQL;

  CREATE OR REPLACE FUNCTION get_project_id(varchar) RETURNS bigint AS
    'SELECT id FROM projects WHERE title = $1;'
  LANGUAGE SQL;

  CREATE OR REPLACE FUNCTION get_page_id(bigint, integer, integer) RETURNS bigint AS
    'SELECT id FROM pages WHERE project_id = $1 AND x = $2 AND y = $3;'
  LANGUAGE SQL;

  -- get user ids created above
  chris_id := get_user_id('chris_testing');
  jon_id := get_user_id('jon_testing');
  andrew_id := get_user_id('andrew_testing');

  -- create some test project data
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail, featured) VALUES
    (chris_id, NULL, 'test', 'test_project_1', empty_json, FALSE),
    (chris_id, NULL, 'test', 'test_project_2', thumb_small, TRUE),
    (jon_id, NULL, 'test', 'test_project_3', empty_json, FALSE),
    (jon_id, NULL, 'test', 'test_project_4', thumb_all, TRUE),
    (andrew_id, NULL, 'test', 'test_project_5', empty_json, FALSE),
    (andrew_id, NULL, 'test', 'test_project_6', thumb_large, TRUE),
    (chris_id, NULL, 'test', 'test_project_7', empty_json, TRUE),
    (andrew_id, NULL, 'test', 'test_project_8', empty_json, TRUE),
    (jon_id, NULL, 'test', 'test_project_9', empty_json, TRUE),
    (andrew_id, NULL, 'test', 'test_project_10', empty_json, TRUE);

  -- grab a project id
  project_id := get_project_id('test_project_1');

  -- create some remixes
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail) VALUES
    (jon_id, project_id, 'test','test_remix_1', empty_json),
    (andrew_id, project_id, 'test', 'test_remix_2', empty_json),
    (jon_id, project_id, 'test','test_remix_3', empty_json),
    (andrew_id, project_id, 'test', 'test_remix_4', empty_json);

  -- create some pages
  INSERT INTO pages (project_id, x, y, styles) VALUES
    (project_id, 0, 0, empty_json),
    (project_id, 0, 1, empty_json),
    (project_id, 1, 0, styles),
    (project_id, 1, 1, empty_json),
    (project_id, -1, 0, styles);

  page_id := get_page_id(project_id, 1, 1);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (page_id, 'text', empty_json, empty_json),
    (page_id, 'text', attributes, styles),
    (page_id, 'text', empty_json, styles),
    (page_id, 'text', attributes, empty_json),
    (page_id, 'text', empty_json, styles),
    (page_id, 'text', attributes, empty_json),
    (page_id, 'text', empty_json, styles);

  page_id := get_page_id(project_id, 1, 0);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (page_id, 'text', empty_json, empty_json),
    (page_id, 'text', attributes, styles),
    (page_id, 'text', empty_json, styles),
    (page_id, 'text', attributes, empty_json),
    (page_id, 'text', empty_json, styles),
    (page_id, 'text', attributes, empty_json),
    (page_id, 'text', empty_json, styles);

  page_id := get_page_id(project_id, -1, 0);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (page_id, 'image', empty_json, empty_json),
    (page_id, 'image', attributes, styles),
    (page_id, 'image', empty_json, styles),
    (page_id, 'image', attributes, empty_json),
    (page_id, 'image', empty_json, styles),
    (page_id, 'image', attributes, empty_json),
    (page_id, 'image', empty_json, styles);
END $$;
