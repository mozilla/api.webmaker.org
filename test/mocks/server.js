require('habitat').load('tests.env');

var Hapi = require('hapi');
var TOKENS = require('./tokens');

function mockTokenValidator(token, callback) {
  var t = TOKENS[token];
  callback(null, !!t, t);
}

module.exports = function(done, opts) {
  var server = new Hapi.Server();
  server.connection();

  if ( opts && opts.enableCache ) {
    process.env.DISABLE_CACHE = false;
  }

  server.register(require('hapi-auth-bearer-token'), function(err) {
    if ( err ) {
      throw err;
    }

    server.auth.strategy('token', 'bearer-access-token', {
      validateFunc:mockTokenValidator,
      allowQueryToken: false,
      tokenType: 'token'
    });

    server.register([
        require('../../services/api/lib/postgre'),
        require('../../services/api/lib/utils')
      ], function() {
      server.route(require('../../services/api/routes'));

      server.start(function() {
        return done(server);
      });
    });
  });
};
