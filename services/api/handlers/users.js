var boom = require('boom');

module.exports = function(request, reply) {
  if (request.method === 'get') {
    return request.server.methods.db.findUser(
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
  } else if (request.method === 'post') {
    return request.server.methods.db.createUser(
      [
        request.payload.username,
        request.payload.language,
        request.payload.country
      ],
      function(err, result) {
        if ( err ) {
          if ( err.constraint === 'unique_username' ) {
            return reply(boom.badRequest('Username taken'));
          }
          return reply(err);
        }

        reply({
          status: 'created',
          user: result.rows[0]
        });
      }
    );
  } else if (request.method === 'patch') {
    return request.server.methods.db.findUser( // TODO: promisify
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

        request.server.methods.db.updateUser(
          [
            user.username,
            user.language,
            user.country,
            request.params.user
          ],
          function(err, result) {
            if ( err ) {
              return reply(err);
            }

            reply({
              status: 'updated',
              user: result.rows[0]
            });
          }
        );
      }
    );
  } else if (request.method === 'delete') {
    return request.server.methods.db.findUser(
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

        request.server.methods.db.deleteUser(
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
  }

  // options method
  reply();
};
