exports.register = function api(server, options, next) {
  server.register([
      require('./lib/postgre'),
      require('./lib/utils')
    ], function(err) {
    if ( err ) {
      return next(err);
    }
    server.route(require('./routes'));
    server.expose('version', process.env.API_VERSION || 'devel');
    next();
  });
};

exports.register.attributes = {
  name: 'webmaker-api-service',
  version: '1.0.0'
};
