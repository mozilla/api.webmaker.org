var boom = require('boom');

function isOwner(tokenId, userId, projectId) {
  tokenId = '' + tokenId;
  userId = '' + userId;
  projectId = '' + projectId;
  return (tokenId === userId && userId === projectId);
}


exports.calculateOffset = {
  assign: 'offset',
  method: function(request, reply) {
    reply((request.query.page - 1) * request.query.count);
  }
};

function createUser(request, reply) {
  request.server.methods.users.create(
    [
      request.auth.credentials.id,
      request.auth.credentials.username,
      request.auth.credentials.prefLocale.split('-')[0],
      request.auth.credentials.prefLocale.split('-')[1]
    ],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      reply(request.server.methods.utils.formatUser(result.rows[0]));
    }
  );
}

exports.getUser = {
  assign: 'user',
  method: function(request, reply) {
    request.server.methods.users.find(
      [
        request.params.user
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        var user = result.rows[0];

        if ( !user ) {
          if (
            request.auth.isAuthenticated &&
            request.params.user.toString() === request.auth.credentials.id
          ) {
            return createUser(request, reply);
          }

          return reply(boom.notFound('User not found'));
        }
        reply(user);
      }
    );
  }
};

exports.getTokenUser = {
  assign: 'tokenUser',
  method: function(request, reply) {
    if (request.params.user.toString() === request.auth.credentials.id) {
      return reply(request.pre.user);
    }

    request.server.methods.users.find(
      [
        request.auth.credentials.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        var user = result.rows[0];

        if ( !user ) {
          return createUser(request, reply);
        }

        reply(user);
      }
    );
  }
};

exports.getProject = {
  assign: 'project',
  method: function(request, reply) {
    request.server.methods.projects.findOne(
      [
        request.params.project,
        request.pre.user.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Project not found'));
        }

        reply(result.rows[0]);
      }
    );
  }
};

exports.getPage = {
  assign: 'page',
  method: function(request, reply) {
    request.server.methods.pages.findOne(
      [
        request.pre.project.id,
        request.params.page
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Page not found'));
        }

        reply(result.rows[0]);
      }
    );
  }
};

exports.prepareRemix = {
  assign: 'remixData',
  method: function(request, reply) {
    request.server.methods.projects.findDataForRemix(
      [
        request.params.project
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Project not found'));
        }

        reply(request.server.methods.utils.formatRemixData(result.rows));
      }
    );
  }
};

exports.getElement = {
  assign: 'element',
  method: function(request, reply) {
    request.server.methods.elements.findOne(
      [
        request.params.element,
        request.pre.page.id
      ],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(boom.notFound('Element not found'));
        }

        reply(result.rows[0]);
      }
    );
  }
};

exports.canCreate = function(request, reply) {
  if ( request.auth.credentials.id === request.pre.user.id ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.canWrite = function(request, reply) {
  var ownsProject = isOwner(
    request.auth.credentials.id,
    request.pre.user.id,
    request.pre.project.user_id
  );

  if ( ownsProject ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.canDelete = function(request, reply) {
  var isModerator = request.pre.tokenUser.moderator;
  if ( isModerator ) {
    return reply();
  }

  var ownsProject = isOwner(
    request.auth.credentials.id,
    request.pre.user.id,
    request.pre.project.user_id
  );

  if ( ownsProject ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.isMod = function(request, reply) {
  if ( request.pre.tokenUser.moderator ) {
    return reply();
  }
  reply(boom.forbidden('Insufficient permissions'));
};
