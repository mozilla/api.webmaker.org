/* jshint bitwise: false */

var boom = require('boom');

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

exports.canModify = function(request, reply) {
  var isModerator = request.auth.credentials.moderator;

  if ( isModerator ) {
    return reply();
  }

  var tokenUserId = request.auth.credentials.user_id;
  var userId = request.pre.user.id;
  var projectUserId = request.pre.project.user_id;

  // use bitwise and to check for equality between user ids
  var ownsProject = !!(tokenUserId & userId & projectUserId);

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
