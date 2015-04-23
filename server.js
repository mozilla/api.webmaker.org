require('habitat').load();

var Hapi = require('hapi'),
    replify = require('replify');

var server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      security: true
    }
  }
});

var connection = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '2015'
};

server.connection(connection);

server.register(require('./adapters/plugins'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering plugins',
      error: err
    });
    throw err;
  }
});

server.register([
  require('./adapters/logger'),
  require('./adapters/postgre')
], function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering adapters',
      error: err
    });
    throw err;
  }
});

replify({ name: 'www-' + process.env.PORT }, server);

server.register(require('./services'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering services',
      error: err
    });
    throw err;
  }

  server.start(function() {
    server.log('info', 'Server started @ ' + server.info.uri);
  });
});

