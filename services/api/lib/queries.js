var projectCols = [
  "projects.id",
  "projects.remixed_from",
  "projects.version",
  "projects.title",
  "projects.featured",
  "projects.created_at",
  "projects.updated_at",
  "projects.thumbnail",
  "users.username",
  "users.id as user_id",
  "users.language as user_language",
  "users.country as user_country",
  "users.created_at as user_created_at",
  "users.updated_at as user_updated_at",
  "users.staff as user_staff",
  "users.moderator as user_moderator"
].join(", ");

var pageCols = [
  "pages.id",
  "pages.x",
  "pages.y",
  "pages.created_at",
  "pages.updated_at",
  "pages.styles",
  "elements.id as elem_id",
  "elements.created_at AS elem_created_at",
  "elements.updated_at AS elem_updated_at",
  "elements.styles AS elem_styles",
  "elements.attributes as elem_attributes",
].join(", ");

module.exports = {
  users: {
    create: "INSERT INTO users (username, language, country) VALUES($1, $2, $3) RETURNING id;",
    find: "SELECT id, username, created_at, updated_at, language, country, moderator, staff " +
      "FROM users WHERE deleted_at IS NULL AND id = $1;",
    update: "UPDATE users SET (username, language, country) = " +
      "($1, $2, $3) WHERE deleted_at IS NULL AND id = $4 RETURNING username, language, country;",
    remove: "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  },
  projects: {
    create: "INSERT INTO projects (user_id, remixed_from, version, title, thumbnail)" +
      " VALUES ($1, $2, $3, $4, $5) RETURNING id;",
    findAll: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at is NULL AND " +
      "projects.user_id = users.id AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $1 OFFSET $2",
    findUsersProjects: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.user_id = $1 " +
      "AND projects.user_id = users.id AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $2 OFFSET $3",
    findOne: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL " +
    " AND projects.id = $1 AND projects.user_id = $2 AND projects.user_id = users.id;",
    update: "UPDATE projects SET (title, thumbnail) = ($1, $2) WHERE deleted_at IS NULL" +
      " AND id = $3 RETURNING id, title, thumbnail;",
    feature: "UPDATE projects SET featured = $1 WHERE deleted_at IS NULL and id = $2 RETURNING id, featured;",
    remove: "UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL",
    findRemixes: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL" +
    " AND remixed_from = $1 AND projects.user_id = users.id ORDER BY updated_at ASC LIMIT $2 OFFSET $3;",
    findFeatured: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL" +
      " AND projects.featured = TRUE AND projects.user_id = users.id ORDER BY updated_at ASC LIMIT $1 OFFSET $2;"
  },
  pages: {
    create: "INSERT INTO pages (project_id, x, y, styles) VALUES ($1, $2, $3, $4) RETURNING id;",
    findAll: "SELECT " + pageCols + " FROM pagesINNER JOIN elements ON pages.project_id = $1 AND " +
      "pages.id = elements.page_id AND pages.deleted_at IS NULL AND elements.deleted_at IS NULL;",
    findOne: "SELECT " + pageCols + " FROM pagesINNER JOIN elements ON pages.id = $1 AND pages.id = elements.page_id" +
      "AND pages.deleted_at IS NULL AND elements.deleted_at IS NULL;",
    update: "UPDATE pages SET (x, y, styles) = ($1, $2, $3) WHERE id = $4 AND deleted_at IS NULL",
    remove: "UPDATE pages SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL"
  },
  elements: {
    create: "INSERT into elements (page_id, attributes, styles) VALUES ($1, $2, $3) RETURNING id",
    findAll: "SELECT id, attributes, styles, created_at, updated_at FROM elements WHERE " +
      "page_id = $1 AND deleted_at IS NULL;",
    findOne: "SELECT id, attributes, styles, created_at, updated_at FROM elements WHERE " +
      "id = $1 AND deleted_at IS NULL;",
    update: "UPDATE elements SET (styles, attributes) = ($1, $2) WHERE id = $3 AND deleted_at IS NULL;",
    remove: "UPDATE elements SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL"
  }
};
