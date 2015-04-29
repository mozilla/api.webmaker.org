require('habitat').load();

var Hapi = require('hapi'),
    Hoek = require('hoek'),
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

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');

var connection = {
  host: process.env.API_HOST,
  port: process.env.PORT
};

server.connection(connection);

if ( process.env.DISABLE_LOGGING !== 'true' ) {
  server.register({
    register: require('hapi-bunyan'),
    options: require('./lib/log-config')()
  }, function(err) {
    if ( err ) {
      server.log('error', {
        message: 'Error registering logger',
        error: err
      });
      throw err;
    }
  });
}

server.register(require('./adapters/plugins'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering plugins',
      error: err
    });
    throw err;
  }

  server.auth.strategy('token', 'bearer-access-token', require('./lib/auth-config'));
});

server.register([
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
    console.log('Server started @ ' + server.info.uri);
  });
});
