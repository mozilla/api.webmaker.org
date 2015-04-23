var queries = require('../lib/queries');
var Boom = require('boom');

module.exports = function(request, reply) {
  if (request.method === 'get') {
    request.server.methods.db.executeQuery(
      queries.findSkittleById,
      [request.params.id],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        if ( !result.rows.length ) {
          return reply(Boom.notFound('Can\'t find skittle'));
        }

        reply(result.rows[0]);
      }
    );
  } else {
    request.server.methods.db.executeQuery(
      queries.createSkittle,
      [request.payload.color],
      function(err, result) {
        if ( err ) {
          return reply(err);
        }

        reply('created');
      }
    );
  }
};
