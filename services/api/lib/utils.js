function formatUser(user) {
  var formatted = {};
  formatted.id = user.id;
  formatted.username = user.username;

  formatted.locale = {
    language: user.language,
    country: user.country
  };

  formatted.history = {
    created_at: user.created_at,
    updated_at: user.updated_at
  };

  formatted.permissions = {
    staff: user.staff,
    moderator: user.moderator
  };

  return formatted;
}

exports.register = function(server, options, done) {
  server.method('utils.formatUser', formatUser, { callback: false });
  done();
};

exports.register.attributes = {
  name: 'webmaker-api-utility-methods',
  version: '1.0.0'
};
