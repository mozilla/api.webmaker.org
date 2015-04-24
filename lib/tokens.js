var TOKENS = {
  "skittlesToken": {
    scope: "skittles",
    user_id: 123
  },
  "skittlesToken2": {
    scope: "skittles",
    user_id: 124
  },
  "missingScope": {
    scope: "user",
    user_id: 123
  }
};

module.exports = function tokenValidator(token, callback) {
  var t = TOKENS[token];
  callback(null, !!t, t);
};
