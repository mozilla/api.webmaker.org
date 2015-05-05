var boom = require('boom');

exports.get = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user]
  ).then(function(result) {
    var user = result.rows[0];

    if ( !user ) {
      return reply(boom.notFound('User not found'));
    }

    if ( user.id !== request.auth.credentials.user_id ) {
      return reply(boom.unauthorized('Insufficient permissions'));
    }

    reply({
      status: 'success',
      user: request.server.methods.utils.formatUser(user)
    });
  }).catch(function(err) {
    reply(err);
  });
};

exports.post = function(request, reply) {
  request.server.methods.users.create(
    [
      request.payload.username,
      request.payload.language,
      request.payload.country
    ]
  ).then(function(result) {
    console.log( result );
    reply({
      status: 'created',
      user: result.rows[0]
    });
  }).catch(function(err) {
    if ( err.constraint === 'unique_username' ) {
      return reply(boom.badRequest('Username taken'));
    }
    reply(err);
  });
};

exports.patch = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user]
  ).then(function(result) {
    if ( !result.rows.length ) {
      return reply(boom.notFound('User not found'));
    }

    var user = result.rows[0];

    if ( user.id !== request.auth.credentials.user_id ) {
      return reply(boom.unauthorized('Insufficient permissions'));
    }

    if ( request.payload.username ) {
      user.username = request.payload.username;
    }

    if ( request.payload.language ) {
      user.language = request.payload.language;
    }

    if ( request.payload.country ) {
      user.country = request.payload.country;
    }

    return request.server.methods.users.update(
      [
        user.username,
        user.language,
        user.country,
        request.params.user
      ]
    );
  }).then(function(result) {
    reply({
      status: 'updated',
      user: result.rows[0]
    });
  }).catch(function(err) {
    reply(err);
  });
};

exports.del = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user]
  ).then(function(result) {
    if ( !result.rows.length ) {
      return reply(boom.notFound('User not found'));
    }

    var user = result.rows[0];

    if ( user.id !== request.auth.credentials.user_id ) {
      return reply(boom.unauthorized('Insufficient permissions'));
    }

    return request.server.methods.users.remove(
      [
        request.params.user
      ]
    );
  }).then(function(result) {
    reply({
      status: 'deleted'
    });
  }).catch(function(err) {
    reply(err);
  });
};

exports.options = function(request, reply) {
  reply();
};
