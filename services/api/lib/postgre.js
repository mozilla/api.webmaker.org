var Hoek = require('hoek');
var pg = require('pg');
var format = require('util').format;
var queries = require('./queries');
var connString = process.env.POSTGRE_CONNECTION_STRING;

Hoek.assert(connString, 'You must provide a connection string to postgre');

exports.register = function(server, options, done) {
  function executeQuery(text, values, callback) {
    server.log('debug', format('Executing Query: %s - params: %s', text, values.join(', ')));
    pg.connect(connString, function(err, client, release) {
      if ( err ) {
        return callback(err);
      }

      client.query({
        text: text,
        values: values
      }, function(err, result) {
        release();
        if ( err ) {
          return callback(err);
        }

        callback(null, result);
      });
    });
  }

  function getMethodConfig (segment, cached) {
    if ( !cached || process.env.DISABLE_CACHE === 'true' ) {
      return {};
    }

    return {
      cache: {
        segment: segment,
        expiresIn: 60000,
        staleIn: 30000,
        staleTimeout: 100
      },
      generateKey: function(args) {
        return args.join(':');
      }
    };
  }

  function generateServerMethods(methods, cached) {
    Object.keys(methods).forEach(function(method) {
      methods[method].forEach(function(func) {
        var query = queries[method][func];
        var methodString = method + '.' + func;
        server.method(methodString, function(values, done) {
          executeQuery(query, values, done);
        }, getMethodConfig(methodString, cached));
      });
    });
  }

  var cachedMethods = {
    projects: [
      'findOne'
    ],
    pages: [
      'findAll',
      'findOne'
    ],
    elements: [
      'findAll',
      'findOne'
    ]
  };

  var nonCachedMethods = {
    users: [
      'find',
      'create',
      'update',
      'remove'
    ],
    projects: [
      'findFeatured',
      'findAll',
      'findUsersProjects',
      'findRemixes',
      'create',
      'update',
      'feature',
      'remove'
    ],
    pages: [
      'create',
      'update',
      'remove'
    ],
    elements: [
      'create',
      'update',
      'remove'
    ]
  };

  generateServerMethods(cachedMethods, true);
  generateServerMethods(nonCachedMethods, false);

  // expose so tests can stub
  server.expose('pg', pg);

  done();
};

exports.register.attributes = {
  name: 'webmaker-postgre-adapter',
  version: '1.0.0'
};
