var projectCols = [
  "projects.id",
  "projects.remixed_from",
  "projects.version",
  "projects.title",
  "projects.featured",
  "projects.created_at",
  "projects.updated_at",
  "projects.thumbnail",
  "projects.user_id"
].join(", ");

var projectUserCols = projectCols + ", " + [
  "users.username",
  "users.id as user_id",
  "users.language as user_language",
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

var elementCols = [
  "elements.id",
  "elements.page_id",
  "elements.type",
  "elements.created_at",
  "elements.updated_at",
  "elements.styles",
  "elements.attributes"
].join(", ");

var remixCols = [
  "projects.id AS project_id",
  "projects.title AS project_title",
  "projects.thumbnail AS project_thumbnail",
  "pages.id AS page_id",
  "pages.project_id AS project_id",
  "pages.x AS page_x",
  "pages.y AS page_y",
  "pages.styles AS page_styles",
  "elements.id AS elem_id",
  "elements.type AS elem_type",
  "elements.styles AS elem_styles",
  "elements.attributes as elem_attributes"
].join(", ");

module.exports = {
  users: {
    // Create user
    // Params: id bigint, username varchar, language varchar
    create: "INSERT INTO users (id, username, language) VALUES($1, $2, $3) RETURNING id, username, " +
      " created_at, updated_at, language, moderator, staff;",

    // Find user
    // Params: id bigint
    find: "SELECT id, username, created_at, updated_at, language, moderator, staff " +
      "FROM users WHERE deleted_at IS NULL AND id = $1;",

    // Update user
    // Params username varchar, language varchar, id bigint
    update: "UPDATE users SET (username, language) = " +
      "($1, $2) WHERE deleted_at IS NULL AND id = $3 RETURNING id, username, " +
      " created_at, updated_at, language, moderator, staff;",

    // Soft delete user
    // Params: id bigint
    remove: "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  },
  projects: {
    // Create project
    // Params:user_id bigint, remixed_from bigint, version varchar, title varchar, thumbnail jsonb
    create: "INSERT INTO projects (user_id, remixed_from, version, title, thumbnail)" +
      " VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, remixed_from, version, title, featured," +
      " created_at, updated_at, thumbnail;",

    // Find all projects, sorted by created_at DESC
    // Params: limit integer, offset integer
    findAll: "SELECT " + projectUserCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE " +
      "projects.deleted_at is NULL AND projects.deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2",

    // Find projects created by given user
    // Params: user_id bigint, offset integer
    findUsersProjects: "SELECT " + projectUserCols + " FROM projects INNER JOIN users ON users.id = projects.user_id " +
      "WHERE projects.user_id = $1 AND projects.deleted_at IS NULL ORDER BY created_at DESC LIMIT $2 OFFSET $3",

    // Find one project by id and user_id
    // params: project_id bigint, user_id bigint
    findOne: "SELECT " + projectUserCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE " +
      "projects.deleted_at IS NULL AND projects.id = $1 AND projects.user_id = $2;",

    // Find one project by ID
    // params: project id
    findOneById: "SELECT projects.user_id, projects.id FROM projects WHERE projects.deleted_at IS NULL AND " +
      "projects.id = $1;",

    // Retrieve data in a project for remixing (joins pages and elements)
    // params: project_id bigint
    findDataForRemix: "SELECT " + remixCols + " FROM projects LEFT OUTER JOIN pages ON projects.id = " +
      "pages.project_id LEFT OUTER JOIN elements ON pages.id = elements.page_id WHERE projects.id = $1 AND " +
      " projects.deleted_at IS NULL AND pages.deleted_at IS NULL AND elements.deleted_at IS NULL",

    // Update project
    // Params title varchar, project_id bigint
    update: "UPDATE projects SET (title) = ($1) WHERE deleted_at IS NULL" +
      " AND id = $2 RETURNING id, user_id, remixed_from, version, title, featured," +
      " created_at, updated_at, thumbnail;",

    // Update project thumbnail
    // Params thumbnail jsonb, project_id bigint
    updateThumbnail: "UPDATE projects SET thumbnail = $1 WHERE deleted_at IS NULL AND id = $2;",

    // Feature Project
    // Params: featured Boolean, project_id bigint
    feature: "UPDATE projects SET featured = $1 WHERE deleted_at IS NULL and id = $2 RETURNING id, user_id, " +
      " remixed_from, version, title, featured, created_at, updated_at, thumbnail;",

    // Soft delete project
    // Params: project_id bigint
    remove: "UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;",

    // Find remixes of a project
    // Params: remixed_from bigint, offset integer, limit integer
    findRemixes: "SELECT " + projectUserCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE" +
      " projects.deleted_at IS NULL AND remixed_from = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;",

    // Find featured projects
    // Params: offset integer, limit integer
    findFeatured: "SELECT " + projectUserCols + " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE" +
      " projects.deleted_at IS NULL AND projects.featured = TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2;",

    // Find featured projects
    // Params: language string, offset integer, limit integer
    findFeaturedByLanguage: "SELECT " + projectUserCols +
      " FROM projects INNER JOIN users ON users.id = projects.user_id WHERE" +
      " projects.deleted_at IS NULL AND projects.featured = TRUE" +
      " ORDER BY" +
      "   CASE users.language" +
      "     WHEN $1 THEN 1" +
      "     ELSE 2" +
      "   END, " +
      " projects.created_at DESC LIMIT $2 OFFSET $3;"
  },
  pages: {
    // Create page
    // Params: project_id bigint, x integer, y integer, styles jsonb
    create: "INSERT INTO pages (project_id, user_id, x, y, styles) VALUES ($1, $2, $3, $4, $5) RETURNING id," +
      " project_id, x, y, created_at, updated_at, styles;",

    // Find all pages in a project
    // Params: project_id bigint
    findAll: "SELECT " + pageCols + " FROM pages LEFT OUTER JOIN elements ON elements.page_id = pages.id AND " +
      " elements.deleted_at IS NULL WHERE pages.project_id = $1 AND pages.deleted_at IS NULL;",

    // Find one page by page id and project id
    // Params: project_id bigint, page_id bigint
    findOne: "SELECT " + pageCols + " FROM pages LEFT OUTER JOIN elements ON elements.page_id = $2 AND " +
      " elements.deleted_at IS NULL WHERE pages.project_id = $1 AND pages.id = $2 AND pages.deleted_at IS NULL",

    // Find one page by id
    // Params: page_id bigint
    findOneById: "SELECT pages.id, pages.project_id FROM pages WHERE pages.deleted_at IS NULL " +
      "AND pages.id = $1;",

    //
    // Update page
    // Params: x integer, y integer, styles jsonb, page_id bigint
    update: "UPDATE pages SET (x, y, styles) = ($1, $2, $3) WHERE id = $4 AND deleted_at IS NULL" +
      " RETURNING id, project_id, x, y, created_at, updated_at, styles;",

    // Soft delete page
    // Params: page_id bigint
    remove: "UPDATE pages SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;",

    // Find lowest page id in a project
    // Params: project_id
    min: "SELECT MIN(pages.id) AS page_id, projects.id AS project_id, projects.user_id as user_id FROM pages " +
      "INNER JOIN projects ON pages.project_id = $1 AND projects.id = pages.project_id AND pages.deleted_at " +
      "IS NULL GROUP BY projects.id;"
  },
  elements: {
    // Create element
    // Params: page_id bigint, type varchar, attributes jsonb, styles jsonb
    create: "INSERT into elements (page_id, type, attributes, styles) VALUES ($1, $2, $3, $4, $5) RETURNING" +
      " id, type, page_id, created_at, updated_at, attributes, styles",

    // Find all elements in a page
    // Params page_id bigint
    findAll: "SELECT id, page_id, type, attributes, styles, created_at, updated_at FROM elements WHERE " +
      "page_id = $1 AND deleted_at IS NULL;",

    // Find one element by id and page_id
    // Params: element_id bigint, page_id bigint
    findOne: "SELECT " + elementCols + " FROM elements WHERE elements.id = $1 AND " +
      "page_id = $2 AND deleted_at IS NULL;",

    // Find one element by id and page_id
    // Params: element_id bigint, page_id bigint
    findOneById: "SELECT id, page_id FROM elements WHERE elements.deleted_at IS NULL AND elements.id = $1;",

    // Update element
    // Params: styles jsonb, attributes jsonb, element_id bigint
    update: "UPDATE elements SET (styles, attributes) = ($1, $2) WHERE id = $3 AND deleted_at IS NULL" +
      " RETURNING id, type, page_id, created_at, updated_at, attributes, styles",

    // Soft delete element
    // Params: element_id bigint
    remove: "UPDATE elements SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL;"
  }
};
