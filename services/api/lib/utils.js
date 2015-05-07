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

function formatProject(project) {
  var formatted = {};
  formatted.id = project.id;
  formatted.version = project.version;
  formatted.title = project.title;
  formatted.remixed_from = project.remixed_from;

  formatted.author = formatUser({
    id: project.id,
    username: project.username,
    created_at: project.user_created_at,
    updated_at: project.user_updated_at,
    language: project.user_language,
    country: project.user_country,
    staff: project.user_staff,
    moderator: project.user_moderator
  });

  formatted.history = {
    created_at: project.created_at,
    updated_at: project.updated_at
  };

  formatted.thumbnail = project.thumbnail;

  return formatted;
}

var API_VERSION = process.env.API_VERSION || 'dev';

function version() {
  return API_VERSION;
}

exports.register = function(server, options, done) {
  server.method('utils.formatUser', formatUser, { callback: false });
  server.method('utils.formatProject', formatProject, { callback: false });
  server.method('utils.version', version, { callback: false });
  done();
};

exports.register.attributes = {
  name: 'webmaker-api-utility-methods',
  version: '1.0.0'
};
