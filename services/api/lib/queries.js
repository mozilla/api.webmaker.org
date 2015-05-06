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

module.exports = {
  users: {
    create: "INSERT INTO users (username, language, country) VALUES($1, $2, $3) RETURNING id;",
    find: "SELECT id, username, created_at, updated_at, language, country, moderator, staff " +
      "FROM users WHERE deleted_at IS NULL AND id = $1;",
    update: "UPDATE users SET (username, language, country) = " +
      "($1, $2, $3) WHERE deleted_at IS NULL AND id = $4 RETURNING username, language, country;",
    remove: "UPDATE users SET deleted_at) = CURRENT_TIMESTAMP WHERE id = $1;"
  },
  projects: {
    create: "INSERT INTO projects (user_id, remixed_from, version, title, thumbnail)" +
      " VALUES ($1, $2, $3, $4, $5) RETURNING id;",
    findAll: "SELECT " + projectCols +" FROM projects INNER JOIN users ON projects.deleted_at is NULL AND " +
      "projects.user_id = users.id AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $1 OFFSET $2",
    findUsersProjects: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.user_id = $1 " +
      "AND projects.user_id = users.id AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $2 OFFSET $3",
    findOne: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL " +
    " AND projects.id = $1 AND projects.user_id = $2 AND projects.user_id = users.id;",
    update: "UPDATE projects SET (title, thumbnail) = ($1, $2) WHERE deleted_at IS NULL" +
      " AND id = $3 RETURNING id, title, thumbnail;",
    feature: "UPDATE projects SET featured = $1 WHERE deleted_at IS NULL and id = $2 RETURNING id, featured;",
    remove: "UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1;",
    findRemixes: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL" +
    " AND remixed_from = $1 AND projects.user_id = users.id ORDER BY updated_at ASC LIMIT $2 OFFSET $3;",
    findFeatured: "SELECT " + projectCols + " FROM projects INNER JOIN users ON projects.deleted_at IS NULL" +
      " AND projects.featured = TRUE AND projects.user_id = users.id ORDER BY updated_at ASC LIMIT $1 OFFSET $2;"
  }
};
