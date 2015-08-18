var Boom = require('boom');

exports.post = function(request, reply) {
  request.server.methods.projects.bulk(
    request.payload.actions,
    '' + request.params.user,
    function(err, results) {
      if ( err ) {
        return reply(Boom.wrap(err));
      }

      var rawResults = results.map(function(result) {
        return result.raw;
      });

      request.server.methods.bulk.invalidateCaches(request, rawResults);

      request.server.methods.projects.processBulkThumbnailRequests(request, rawResults);

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
