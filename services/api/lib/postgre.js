/* global Promise */

var Hoek = require('hoek');
var pg = require('pg');
var format = require('util').format;
var queries = require('./queries');
var connString = process.env.POSTGRE_CONNECTION_STRING;

Hoek.assert(connString, 'You must provide a connection string to postgre');

exports.register = function(server, options, done) {
  function executeQuery(text, values) {
    return new Promise(function(resolve, reject) {
      server.log('debug', format('Executing Query: %s - params: %s', text, values.join(', ')));
      pg.connect(connString, function(err, client, release) {
        if ( err ) {
          return reject(err);
        }

        client.query({
          text: text,
          values: values
        }, function(err, result) {
          release();
          if ( err ) {
            return reject(err);
          }

          resolve(result);
        });
      });
    });
  }

  server.method('users.create', function(values) {
    return executeQuery(queries.users.create, values);
  }, { callback: false });

  server.method('users.find', function(values) {
    return executeQuery(queries.users.find, values);
  }, { callback: false });

  server.method('users.update', function(values) {
    return executeQuery(queries.users.update, values);
  }, { callback: false });

  server.method('users.remove', function(values) {
    return executeQuery(queries.users.remove, values);
  }, { callback: false });

  done();
};

exports.register.attributes = {
  name: 'webmaker-postgre-adapter',
  version: '1.0.0'
};
