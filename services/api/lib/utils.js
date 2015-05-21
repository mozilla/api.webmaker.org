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
  formatted.featured = project.featured;

  // Updates/creates don't include user data
  if ( project.username ) {
    formatted.author = formatUser({
      id: project.user_id,
      username: project.username,
      created_at: project.user_created_at,
      updated_at: project.user_updated_at,
      language: project.user_language,
      country: project.user_country,
      staff: project.user_staff,
      moderator: project.user_moderator
    });
  }

  formatted.history = {
    created_at: project.created_at,
    updated_at: project.updated_at
  };

  formatted.thumbnail = project.thumbnail;

  return formatted;
}

function formatPage(rows) {
  var elements = [];

  rows.forEach(function(row) {
    if ( !row.elem_id ) {
      return;
    }
    elements.push({
      id: row.elem_id,
      type: row.elem_type,
      attributes: row.elem_attributes,
      styles: row.elem_styles,
      history: {
        created_at: row.elem_created_at,
        updated_at: row.elem_updated_at
      }
    });
  });

  return {
    id: rows[0].id,
    project_id: rows[0].project_id,
    x: rows[0].x,
    y: rows[0].y,
    styles: rows[0].styles,
    history: {
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at
    },
    elements: elements
  };
}

function formatPages(rows) {
  var sorted = {};

  rows.forEach(function(row) {
    if ( !sorted[row.id] ) {
      sorted[row.id] = [];
    }

    sorted[row.id].push(row);
  });

  return Object.keys(sorted).map(function(key) {
    return formatPage(sorted[key]);
  });
}

function formatElement(el) {
  return {
    id: el.id,
    page_id: el.page_id,
    type: el.type,
    attributes: el.attributes,
    styles: el.styles,
    history: {
      created_at: el.created_at,
      updated_at: el.updated_at
    }
  };
}

var API_VERSION = process.env.API_VERSION;

function version() {
  return API_VERSION;
}

var CLIENT_ID = process.env.CLIENT_ID;

function clientId() {
  return CLIENT_ID;
}

exports.register = function(server, options, done) {
  server.method('utils.formatUser', formatUser, { callback: false });
  server.method('utils.formatProject', formatProject, { callback: false });
  server.method('utils.formatPage', formatPage, { callback: false });
  server.method('utils.formatPages', formatPages, { callback: false });
  server.method('utils.formatElement', formatElement, { callback: false });
  server.method('utils.version', version, { callback: false });
  done();
};

exports.register.attributes = {
  name: 'webmaker-api-utility-methods',
  version: '1.0.0'
};
