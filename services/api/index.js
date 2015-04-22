var Hoek = require('hoek');

exports.register = function api(server, options, next) {

  var plugins = require('./adapters/plugins');
  server.register(plugins, function(err) {
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
