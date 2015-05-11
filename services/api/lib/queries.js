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
  "pages.project_id",
  "pages.x",
  "pages.y",
  "pages.created_at",
  "pages.updated_at",
  "pages.styles",
  "elements.id AS elem_id",
  "elements.type AS elem_type",
  "elements.created_at AS elem_created_at",
  "elements.updated_at AS elem_updated_at",
  "elements.styles AS elem_styles",
  "elements.attributes as elem_attributes"
].join(", ");

module.exports = {
  users: {
    // Create user
    // Params: username varchar, language varchar, country varchar
    create: "INSERT INTO users (username, language, country) VALUES($1, $2, $3) RETURNING id;",

    // Find user
    // Params: id bigint
    find: "SELECT id, username, created_at, updated_at, language, country, moderator, staff " +
      "FROM users WHERE deleted_at IS NULL AND id = $1;",

    // Update user
    // Params username varchar, language varchar, country varchar, id bigint
    update: "UPDATE users SET (username, language, country) = " +
      "($1, $2, $3) WHERE deleted_at IS NULL AND id = $4 RETURNING username, language, country;",

    // Soft delete user
    // Params: id bigint
    remove: "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  },
  projects: {
    // Create project
    // Params:user_id bigint, remixed_from bigint, version varchar, title varchar, thumbnail jsonb
    create: "INSERT INTO projects (user_id, remixed_from, version, title, thumbnail)" +
      " VALUES ($1, $2, $3, $4, $5) RETURNING id;",

    // Find all projects, sorted by updated_at ASC
    // Params: limit integer, offset integer
    findAll: "SELECT " + projectCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE " +
    "projects.deleted_at is NULL AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $1 OFFSET $2",

    // Find projects created by given user
    // Params: user_id bigint, limit integer, offset integer
    findUsersProjects: "SELECT " + projectCols + " FROM projects INNER JOIN users ON users.id = projects.user_id " +
    "WHERE projects.user_id = $1 AND projects.deleted_at IS NULL ORDER BY updated_at ASC LIMIT $2 OFFSET $3",

    // Find one project by id
    // params: project_id bigint, user_id bigint
    findOne: "SELECT " + projectCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE " +
      " projects.deleted_at IS NULL AND projects.id = $1 AND projects.user_id = $2;",

    // Update project
    // Params title varchar, thumbnail jsonb, project_id bigint
    update: "UPDATE projects SET (title, thumbnail) = ($1, $2) WHERE deleted_at IS NULL" +
      " AND id = $3 RETURNING id, title, thumbnail;",

    // Feature Project
    // Params: featured Boolean, project_id bigint
    feature: "UPDATE projects SET featured = $1 WHERE deleted_at IS NULL and id = $2 RETURNING id, featured;",

    // Soft delete project
    // Params: project_id bigint
    remove: "UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;",

    // Find remixes of a project
    // Params: remixed_from bigint, offset integer, limit integer
    findRemixes: "SELECT " + projectCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE" +
      " projects.deleted_at IS NULL AND remixed_from = $1 ORDER BY updated_at ASC LIMIT $2 OFFSET $3;",

    // Find featured projects
    // Params: offset integer, limit integer
    findFeatured: "SELECT " + projectCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE" +
      " projects.deleted_at IS NULL AND projects.featured = TRUE ORDER BY updated_at ASC LIMIT $1 OFFSET $2;"
  },
  pages: {
    // Create page
    // Params: project_id bigint, x integer, y integer, styles jsonb
    create: "INSERT INTO pages (project_id, x, y, styles) VALUES ($1, $2, $3, $4) RETURNING id;",

    // Find all pages in a project
    // Params: project_id bigint
    findAll: "SELECT " + pageCols + " FROM pages LEFT OUTER JOIN elements ON elements.page_id = pages.id AND " +
    " elements.deleted_at IS NULL WHERE pages.project_id = $1 AND pages.deleted_at IS NULL;",

    // Find one page in a project
    // Params: project_id bigint, page_id bigint
    findOne: "SELECT " + pageCols + " FROM pages LEFT OUTER JOIN elements ON elements.page_id = $2 AND " +
    " elements.deleted_at IS NULL WHERE pages.project_id = $1 AND pages.id = $2 AND pages.deleted_at IS NULL",

    // Update page
    // Params: x integer, y integer, styles jsonb, page_id bigint
    update: "UPDATE pages SET (x, y, styles) = ($1, $2, $3) WHERE id = $4 AND deleted_at IS NULL" +
      " RETURNING x, y, styles;",

    // Soft delete page
    // Params: page_id bigint
    remove: "UPDATE pages SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  },
  elements: {
    // Create element
    // Params: page_id bigint, type varchar, attributes jsonb, styles jsonb
    create: "INSERT into elements (page_id, type, attributes, styles) VALUES ($1, $2, $3, $4) RETURNING id",

    // Find all elements in a page
    // Params page_id bigint
    findAll: "SELECT id, page_id, type, attributes, styles, created_at, updated_at FROM elements WHERE " +
      "page_id = $1 AND deleted_at IS NULL;",

    // Find one element by id and page_id
    // Params: element_id bigint, page_id bigint
    findOne: "SELECT id, page_id, type, attributes, styles, created_at, updated_at FROM elements WHERE " +
      "id = $1 AND page_id = $2 AND deleted_at IS NULL;",

    // Update element
    // Params: styles jsonb, attributes jsonb, element_id bigint
    update: "UPDATE elements SET (styles, attributes) = ($1, $2) WHERE id = $3 AND deleted_at IS NULL" +
      " RETURNING styles, attributes;",

    // Soft delete element
    // Params: element_id bigint
    remove: "UPDATE elements SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  }
};
