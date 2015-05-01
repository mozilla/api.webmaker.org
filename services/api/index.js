exports.register = function api(server, options, next) {
  server.register([
      require('./lib/postgre'),
      require('./lib/utils')
    ], function(err) {
    if ( err ) {
      return next(err);
    }
    server.route(require('./routes'));
    next();
  });
};

exports.register.attributes = {
  name: 'webmaker-api-service',
  version: '1.0.0'
};
