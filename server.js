require('habitat').load();
require('newrelic');

var Hapi = require('hapi'),
    Hoek = require('hoek');

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');
Hoek.assert(process.env.API_VERSION, 'Must define API_VERSION');
Hoek.assert(process.env.REDIS_URL, 'Must define REDIS_URL');
Hoek.assert(process.env.POSTGRE_CONNECTION_STRING, 'Must define POSTGRE_CONNECTION_STRING');

var serverConfig = {
  connections: {
    router: {
      stripTrailingSlash: true
    },
    routes: {
      security: true
    }
  }
};

if ( process.env.REDIS_URL ) {
  var redisUrl = require('redis-url').parse(process.env.REDIS_URL);
  serverConfig.cache = {
    engine: require('catbox-redis'),
    host: redisUrl.hostname,
    port: redisUrl.port,
    password: redisUrl.password
  };
}

var server = new Hapi.Server(serverConfig);

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');

var connection = {
  uri: process.env.URI,
  host: process.env.API_HOST,
  port: process.env.PORT
};

server.connection(connection);

server.register({
  register: require('hapi-bunyan'),
  options: require('./lib/log-config')()
}, function(err) {
  Hoek.assert(!err, err);
});

server.register(require('./adapters/plugins'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering plugins',
      error: err
    });
    throw err;
  }

  var authConfig = require('./lib/auth-config');
  var tokenValidator = process.env.MOCKED_AUTH ?
    require('./lib/mockValidator') : require('./lib/tokenValidator');

  server.auth.strategy(
    'token',
    'bearer-access-token',
    authConfig(tokenValidator)
  );
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
      Hoek.assert(!err, err);
    }
    console.log('Server started @ ' + server.info.uri);
  });
});
