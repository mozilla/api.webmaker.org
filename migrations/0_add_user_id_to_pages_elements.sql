ALTER TABLE pages
ADD COLUMN user_id bigint REFERENCES users(id);

ALTER TABLE elements
ADD COLUMN user_id bigint REFERENCES users(id);

WITH user_ids_for_pages AS (
  SELECT projects.user_id AS user_id, pages.id AS page_id
  FROM pages
  INNER JOIN projects
  ON projects.id = pages.project_id
)
UPDATE pages
SET user_id = (
    SELECT user_id
    FROM user_ids_for_pages
    WHERE user_ids_for_pages.page_id = pages.id
  )
WHERE pages.user_id IS NULL;

WITH user_ids_for_elements AS (
  SELECT projects.user_id AS user_id, elements.id AS element_id
  FROM elements
  INNER JOIN pages
  ON pages.id = elements.page_id
  INNER JOIN projects
  ON projects.id = pages.project_id
)
UPDATE elements
SET user_id = (
    SELECT user_id
    FROM user_ids_for_elements
    WHERE user_ids_for_elements.element_id = elements.id
  )
WHERE elements.user_id IS NULL;
