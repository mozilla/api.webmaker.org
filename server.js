require('habitat').load();

var Hapi = require('hapi'),
    Hoek = require('hoek');

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');
Hoek.assert(process.env.API_VERSION, 'Must define API_VERSION');
Hoek.assert(process.env.REDIS_URL, 'Must define REDIS_URL');

var redisConfig = require('redis-url').parse(process.env.REDIS_URL);

var server = new Hapi.Server({
  cache: {
    engine: require('catbox-redis'),
    host: redisConfig.hostname,
    port: redisConfig.port,
    password: redisConfig.password
  },
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      security: true
    }
  }
});

server.connection({
  host: process.env.API_HOST,
  port: process.env.PORT
});

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

server.register(require('./services'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering services',
      error: err
    });
    throw err;
  }

  server.start(function(err) {
    if ( err ) {
      console.error(err);
      return;
    }
    console.log('Server started @ ' + server.info.uri);
  });
});
