var TOKENS = {
  "validToken": {
    scope: ["user", "projects"],
    user_id: 1,
    moderator: false,
    admin: false
  },
  "validToken2": {
    scope: ["user", "projects"],
    user_id: 2,
    moderator: false,
    admin: false
  },
  "missingScope": {
    scope: "projects",
    user_id: 3,
    moderator: false,
    admin: false
  },
  "moderatorToken": {
    scope: ["user", "projects"],
    user_id: 2,
    moderator: true,
    admin: false
  }
};

module.exports = function tokenValidator(token, callback) {
  var t = TOKENS[token];
  callback(null, !!t, t);
};
