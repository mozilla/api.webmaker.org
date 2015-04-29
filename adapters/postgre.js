var Hoek = require('hoek');
var pg = require('pg');
var format = require('util').format;
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

  server.method('db.executeQuery', executeQuery, {});
};

exports.register.attributes = {
  name: 'webmaker-postgre-adapter',
  version: '1.0.0'
};


