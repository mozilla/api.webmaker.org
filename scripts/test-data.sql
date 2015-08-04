DO $$

DECLARE
  chris_id bigint;
  jon_id bigint;
  andrew_id bigint;
  atique_id bigint;
  ina_id bigint;
  bobby_id bigint;
  empty_json jsonb := '{}'::jsonb;
  thumb jsonb := '{"320": "https://example.com/320.png"}'::jsonb;
  styles jsonb := '{"color": "#FF0000"}'::jsonb;
  attributes jsonb := '{"text": "test text"}'::jsonb;

BEGIN

  -- create users
  INSERT INTO users (id, username, language, moderator, staff) VALUES
    (1, 'chris_testing', 'en-CA', FALSE, FALSE),
    (2, 'jon_testing', 'en-US', FALSE, FALSE),
    (3, 'andrew_testing', 'en-GB', TRUE, FALSE),
    (4, 'kate_testing', 'en-GB', FALSE, TRUE),
    (5, 'atique_testing', 'bn-BD', FALSE, TRUE),
    (6, 'ina_testing', 'id-ID', FALSE, TRUE),
    (7, 'bobby_testing', 'lol-rofl', FALSE, TRUE);

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
  atique_id := get_user_id('atique_testing');
  ina_id := get_user_id('ina_testing');
  bobby_id := get_user_id('bobby_testing');

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
    (andrew_id, NULL, 'test', 'test_project_10', empty_json, TRUE),
    (atique_id, NULL, 'test', 'test_project_11', empty_json, TRUE),
    (atique_id, NULL, 'test', 'test_project_12', empty_json, TRUE),
    (ina_id, NULL, 'test', 'test_project_13', empty_json, TRUE),
    (ina_id, NULL, 'test', 'test_project_14', empty_json, TRUE),
    (ina_id, NULL, 'test', 'test_project_15', empty_json, TRUE),
    (bobby_id, NULL, 'test', 'test_project_16', empty_json, TRUE),
    (bobby_id, NULL, 'test', 'test_project_17', empty_json, TRUE),
    (bobby_id, NULL, 'test', 'test_project_18', empty_json, TRUE),
    (bobby_id, NULL, 'test', 'test_project_19', empty_json, TRUE);

  -- create some remixes
  INSERT INTO projects (user_id, remixed_From, version, title, thumbnail) VALUES
    (jon_id, 1, 'test','test_remix_1', empty_json),
    (andrew_id, 1, 'test', 'test_remix_2', empty_json),
    (jon_id, 1, 'test','test_remix_3', empty_json),
    (andrew_id, 1, 'test', 'test_remix_4', empty_json);

  -- create some pages
  INSERT INTO pages (project_id, user_id, x, y, styles) VALUES
    (1, 1, 0, 0, empty_json),
    (1, 1, 0, 1, empty_json),
    (1, 1, 1, 0, styles),
    (1, 1, 2, 1, empty_json),
    (1, 1, -1, 0, styles);

  INSERT INTO pages (project_id, user_id, x, y, styles) VALUES
    (7, 1, 0, 0, empty_json);

  INSERT INTO pages (project_id, user_id, x, y, styles) VALUES
    (3, 2, 0, 0, empty_json),
    (3, 2, 0, 1, empty_json),
    (3, 2, 1, 0, styles),
    (3, 2, 1, 1, empty_json),
    (3, 2, -1, 0, styles);

  INSERT INTO pages (project_id, user_id, x, y, styles, deleted_at) VALUES
    (2, 1, 10, 10, empty_json, current_timestamp);

  INSERT INTO elements (page_id, user_id, type, attributes, styles) VALUES
    (1, 1,  'text', empty_json, empty_json),
    (1, 1, 'image', attributes, styles),
    (1, 1,  'text', empty_json, styles),
    (1, 1, 'image', empty_json, styles),
    (1, 1, 'image', empty_json, styles),
    (1, 1,  'text', attributes, empty_json),
    (1, 1, 'image', empty_json, styles),
    (7, 1,  'text', empty_json, empty_json),
    (7, 1,  'text', empty_json, styles),
    (7, 1,  'text', empty_json, styles),
    (8, 2,  'text', empty_json, empty_json),
    (8, 2, 'image', attributes, styles),
    (8, 2,  'text', empty_json, styles),
    (8, 2,  'text', attributes, empty_json),
    (8, 2, 'image', empty_json, styles),
    (8, 2,  'text', attributes, empty_json),
    (8, 2,  'text', empty_json, styles),
    (10, 2, 'image', empty_json, empty_json),
    (10, 2,  'text', attributes, styles),
    (10, 2,  'text', empty_json, styles),
    (10, 2, 'image', attributes, empty_json),
    (10, 2,  'text', empty_json, styles),
    (10, 2,  'text', attributes, empty_json),
    (10, 2, 'image', empty_json, styles),
    (3, 1,  'text', empty_json, styles),
    (3, 1,  'text', attributes, empty_json),
    (4, 1, 'image', empty_json, styles),
    (4, 1,  'text', attributes, empty_json),
    (4, 1,  'text', empty_json, styles),
    (3, 1,  'link', '{"targetProjectId": "1","targetPageId": "4", "targetUserId": "1"}'::jsonb, empty_json),
    (3, 1,  'text', attributes, empty_json),
    (4, 1,  'link', '{"targetProjectId": "1","targetPageId": "3", "targetUserId": "1"}'::jsonb, styles),
    (4, 1, 'image', empty_json, styles),
    (4, 1,  'link', '{"targetProjectId": "1","targetPageId": "2", "targetUserId": "1"}'::jsonb, styles);

END $$;
