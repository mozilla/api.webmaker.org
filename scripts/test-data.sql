DO $$

DECLARE
  chris_id bigint;
  jon_id bigint;
  andrew_id bigint;
  empty_json jsonb := '{}'::jsonb;
  thumb jsonb := '{"320": "https://example.com/320.png"}'::jsonb;
  styles jsonb := '{"color": "#FF0000"}'::jsonb;
  attributes jsonb := '{"text": "test text"}'::jsonb;

BEGIN

  -- create users
  INSERT INTO users (id, username, language, country, moderator, staff) VALUES
    (1, 'chris_testing', 'en', 'CA', FALSE, FALSE),
    (2, 'jon_testing', 'en', 'US', FALSE, FALSE),
    (3, 'andrew_testing', 'en', 'GB', TRUE, FALSE),
    (4, 'kate_testing', 'en', 'GB', FALSE, TRUE);

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
    (chris_id, NULL, 'test', 'test_project_2', thumb, TRUE),
    (jon_id, NULL, 'test', 'test_project_3', empty_json, FALSE),
    (jon_id, NULL, 'test', 'test_project_4', thumb, TRUE),
    (andrew_id, NULL, 'test', 'test_project_5', empty_json, FALSE),
    (andrew_id, NULL, 'test', 'test_project_6', thumb, TRUE),
    (chris_id, NULL, 'test', 'test_project_7', empty_json, TRUE),
    (andrew_id, NULL, 'test', 'test_project_8', empty_json, TRUE),
    (jon_id, NULL, 'test', 'test_project_9', empty_json, TRUE),
    (andrew_id, NULL, 'test', 'test_project_10', empty_json, TRUE);

  -- create some remixes
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail) VALUES
    (jon_id, 1, 'test','test_remix_1', empty_json),
    (andrew_id, 1, 'test', 'test_remix_2', empty_json),
    (jon_id, 1, 'test','test_remix_3', empty_json),
    (andrew_id, 1, 'test', 'test_remix_4', empty_json);

  -- create some pages
  INSERT INTO pages (project_id, x, y, styles) VALUES
    (1, 0, 0, empty_json),
    (1, 0, 1, empty_json),
    (1, 1, 0, styles),
    (1, 1, 1, empty_json),
    (1, -1, 0, styles);

  INSERT INTO pages (project_id, x, y, styles) VALUES
    (7, 0, 0, empty_json);

  INSERT INTO pages (project_id, x, y, styles) VALUES
    (3, 0, 0, empty_json),
    (3, 0, 1, empty_json),
    (3, 1, 0, styles),
    (3, 1, 1, empty_json),
    (3, -1, 0, styles);

  INSERT INTO pages (project_id, x, y, styles, deleted_at) VALUES
    (2, 10, 10, empty_json, current_timestamp);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (1, 'text', empty_json, empty_json),
    (1, 'image', attributes, styles),
    (1, 'link button', empty_json, styles),
    (1, 'text', attributes, empty_json),
    (1, 'image', empty_json, styles),
    (1, 'text', attributes, empty_json),
    (1, 'link button', empty_json, styles);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (7, 'text', empty_json, empty_json),
    (7, 'link button', empty_json, styles),
    (7, 'link button', empty_json, styles);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (8, 'text', empty_json, empty_json),
    (8, 'image', attributes, styles),
    (8, 'link button', empty_json, styles),
    (8, 'text', attributes, empty_json),
    (8, 'image', empty_json, styles),
    (8, 'link button', attributes, empty_json),
    (8, 'text', empty_json, styles);

  INSERT INTO elements (page_id, type, attributes, styles) VALUES
    (10, 'image', empty_json, empty_json),
    (10, 'link button', attributes, styles),
    (10, 'text', empty_json, styles),
    (10, 'image', attributes, empty_json),
    (10, 'link button', empty_json, styles),
    (10, 'text', attributes, empty_json),
    (10, 'image', empty_json, styles);
END $$;
