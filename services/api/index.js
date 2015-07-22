try {
  var pg = require('pg').native;
} catch (ex) {
  console.warn('Native pg bindings failed to load or are not installed:', ex);
  pg = require('pg');
  console.warn('Connected to pg using non-native bindings.\n');
}

exports.register = function api(server, options, next) {
  server.register([
      require('./lib/utils'),
      require('./lib/postgre')(pg),
      require('./lib/thumbnails'),
      require('./lib/cache'),
      require('./lib/bulk')
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
