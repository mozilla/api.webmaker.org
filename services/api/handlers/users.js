var boom = require('boom');

exports.get = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

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
    }
  );
};

exports.post = function(request, reply) {
  request.server.methods.users.create(
    [
      request.payload.id,
      request.payload.username,
      request.payload.language,
      request.payload.country
    ],
    function(err, result) {
      if ( err ) {
        if ( err.constraint === 'unique_username' ) {
          return reply(boom.badRequest('Username taken'));
        }
        if ( err.constraint === 'users_id_pk' ) {
          return reply(boom.badRequest('Duplicate user id'));
        }
        return reply(err);
      }

      reply({
        status: 'created',
        user: request.server.methods.utils.formatUser(result.rows[0])
      });
    }
  );
};

exports.patch = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

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

      request.server.methods.users.update(
        [
          user.username,
          user.language,
          user.country,
          request.params.user
        ],
        function(err, result) {
          if ( err ) {
            if ( err.constraint === 'unique_username' ) {
              return reply(boom.badRequest('Username taken'));
            }
            return reply(err);
          }

          reply({
            status: 'updated',
            user: request.server.methods.utils.formatUser(result.rows[0])
          });
        }
      );
    }
  );
};

exports.del = function(request, reply) {
  request.server.methods.users.find(
    [request.params.user],
    function(err, result) {
      if ( err ) {
        return reply(err);
      }

      if ( !result.rows.length ) {
        return reply(boom.notFound('User not found'));
      }

      var user = result.rows[0];

      if ( user.id !== request.auth.credentials.user_id ) {
        return reply(boom.unauthorized('Insufficient permissions'));
      }

      request.server.methods.users.remove(
        [
          request.params.user
        ],
        function(err, result) {
          if ( err ) {
            return reply(err);
          }

          reply({
            status: 'deleted'
          });
        }
      );
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
