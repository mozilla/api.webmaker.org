var TOKENS = {
  "skittlesToken": {
    scope: "skittles"
  },
  "missingScope": {
    scope: "user"
  }
};

module.exports = function tokenValidator(token, callback) {
  var t = TOKENS[token];
  callback(null, !!t, t);
};
