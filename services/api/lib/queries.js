module.exports = {
  users: {
    create: "INSERT INTO users (username, language, country) VALUES($1, $2, $3) RETURNING id;",
    find: "SELECT id, username, created_at, updated_at, language, country, moderator, staff " +
      "FROM users WHERE deleted_at IS NULL AND id = $1;",
    update: "UPDATE users SET(username, language, country) = " +
      "($1, $2, $3) WHERE deleted_at IS NULL AND id = $4 RETURNING username, language, country;",
    remove: "UPDATE users SET(deleted_at) = (CURRENT_TIMESTAMP) WHERE id = $1;"
  }
};
