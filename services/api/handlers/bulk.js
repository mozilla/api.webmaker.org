var Boom = require('boom');

exports.post = function(request, reply) {
  request.server.methods.projects.bulk(
    request.payload.actions,
    function(err, results) {
      if ( err ) {
        return reply(Boom.wrap(err));
      }

      reply({
        status: 'success',
        results: results
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
