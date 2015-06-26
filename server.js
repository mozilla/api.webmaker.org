require('habitat').load();
require('newrelic');

var Hapi = require('hapi'),
    Hoek = require('hoek');

Hoek.assert(process.env.API_HOST, 'Must define API_HOST');
Hoek.assert(process.env.PORT, 'Must define PORT');
Hoek.assert(process.env.API_VERSION, 'Must define API_VERSION');

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
  server.decorate('server', 'debug', function(logData) {
    this.log.bind(this, 'debug').apply(this, arguments);
  });
});

server.register(require('./adapters/plugins'), function(err) {
  if ( err ) {
    server.log('error', {
      message: 'Error registering plugins',
      error: err
    });
    throw err;
  }

  server.auth.strategy(
    'token',
    'bearer-access-token',
    require('./lib/auth-config')(require('./lib/tokenValidator'))
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
