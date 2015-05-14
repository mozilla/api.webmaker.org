/* jshint bitwise: false */

var boom = require('boom');

function isOwner(tokenId, userId, projectId) {
  return (tokenId === userId) &&
    (userId === projectId);
}

exports.calculateOffset = {
  assign: 'offset',
  method: function(request, reply) {
    var offset = (request.query.page - 1) * request.query.count;
    reply(offset);
  }
};

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
          return reply(boom.notFound('User not found'));
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
  if ( request.auth.credentials.user_id === request.pre.user.id ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.canWrite = function(request, reply) {
  var ownsProject = isOwner(
    request.auth.credentials.user_id,
    request.pre.user.id,
    request.pre.project.user_id
  );

  if ( ownsProject ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.canDelete = function(request, reply) {
  var isModerator = request.auth.credentials.moderator;
  if ( isModerator ) {
    return reply();
  }

  var ownsProject = isOwner(
    request.auth.credentials.user_id,
    request.pre.user.id,
    request.pre.project.user_id
  );

  if ( ownsProject ) {
    return reply();
  }

  reply(boom.forbidden('Insufficient permissions'));
};

exports.isMod = function(request, reply) {
  if ( request.auth.credentials.moderator ) {
    return reply();
  }
  reply(boom.forbidden('Insufficient permissions'));
};
