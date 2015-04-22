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

var connection = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '2015'
};

server.connection(connection);

server.register(require('./adapters/plugins'), function(err){ Hoek.assert(!err, err); });

replify({ name: 'www-'+process.env.PORT }, server);

server.register(require('./services'), function(err) {
  Hoek.assert(!err, err);

  server.start(function() {
    console.info('Server started @ ' + server.info.uri);
  });
});

