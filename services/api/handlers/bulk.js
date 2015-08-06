var Boom = require('boom');

exports.post = function(request, reply) {
  request.server.methods.projects.bulk(
    request.payload.actions,
    '' + request.params.user,
    function(err, results) {
      if ( err ) {
        return reply(Boom.wrap(err));
      }

      request.server.methods.newrelic.createTracer(
        'process cache invalidations',
        request.server.methods.bulk.invalidateCaches
      );
      request.server.methods.bulk.invalidateCaches(request, results.map(function(result) {
        return result.raw;
      }));

      reply({
        status: 'success',
        results: results.map(function(result) {
          return result.formatted;
        })
      });
    }
  );
};

exports.options = function(request, reply) {
  reply();
};
