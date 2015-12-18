function formatUser(user) {
  var formatted = {};
  formatted.id = user.id;
  formatted.username = user.username;

  formatted.locale = {
    language: user.language
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
  formatted.user_id = project.user_id;
  formatted.version = project.version;
  formatted.title = project.title;
  formatted.remixed_from = project.remixed_from;
  formatted.featured = project.featured;
  formatted.description = project.description;
  formatted.tags = project.tags;

  // Updates/creates don't include user data
  if ( project.username ) {
    formatted.author = formatUser({
      id: project.user_id,
      username: project.username,
      created_at: project.user_created_at,
      updated_at: project.user_updated_at,
      language: project.user_language,
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
      user_id: row.user_id,
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
    user_id: rows[0].user_id,
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
    user_id: el.user_id,
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

function formatRemixPage(rows) {
  var elements = [];

  rows.forEach(function(row) {
    if ( !row.elem_id ) {
      return;
    }
    elements.push({
      id: row.elem_id,
      type: row.elem_type,
      attributes: row.elem_attributes,
      styles: row.elem_styles
    });
  });

  return {
    id: rows[0].page_id,
    x: rows[0].page_x,
    y: rows[0].page_y,
    styles: rows[0].page_styles,
    elements: elements
  };
}

function formatRemixData(rows) {
  var pages = {};

  rows.forEach(function(row) {
    var pageId = row.page_id;
    if ( !pages[pageId] ) {
      pages[pageId] = [];
    }
    pages[pageId].push(row);
  });

  pages = Object.keys(pages).map(function(key) {
    return formatRemixPage(pages[key]);
  });

  return {
    id: rows[0].project_id,
    title: rows[0].project_title,
    thumbnail: rows[0].project_thumbnail,
    description: rows[0].project_description,
    metadata: rows[0].project_metadata,
    pages: pages
  };
}

function extractTags(description) {
  var tagRegex = /#([A-Za-z\d]+)/g;
  var tags = [];
  var tag;

  if (description && description.length) {
    while ((tag = tagRegex.exec(description)) !== null) {
      if (tags.indexOf(tag[1]) === -1) {
        tags.push(tag[1]);
      }
    }
  }

  return tags;
}

var API_VERSION = process.env.API_VERSION;

function version() {
  return API_VERSION;
}

var FEATURED_TAGS = process.env.FEATURED_TAGS;
FEATURED_TAGS = FEATURED_TAGS.split(' ').map((tag) => tag.trim());

function featuredTags() {
  return FEATURED_TAGS;
}

exports.register = function(server, options, done) {
  server.method('utils.formatUser', formatUser, { callback: false });
  server.method('utils.formatProject', formatProject, { callback: false });
  server.method('utils.formatPage', formatPage, { callback: false });
  server.method('utils.formatPages', formatPages, { callback: false });
  server.method('utils.formatElement', formatElement, { callback: false });
  server.method('utils.formatRemixData', formatRemixData, { callback: false });
  server.method('utils.extractTags', extractTags, { callback: false });
  server.method('utils.version', version, { callback: false });
  server.decorate('server', 'featuredTags', featuredTags);
  done();
};

exports.register.attributes = {
  name: 'webmaker-api-utility-methods',
  version: '1.0.0'
};
