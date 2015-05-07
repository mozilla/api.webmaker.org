var Hoek = require('hoek');
var pg = require('pg');
var format = require('util').format;
var queries = require('./queries');
var connString = process.env.POSTGRE_CONNECTION_STRING || 'postgre://localhost:5432/webmaker_testing';

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

  server.method('users.create', function(values, done) {
    executeQuery(queries.users.create, values, done);
  }, {});

  server.method('users.find', function(values, done) {
    executeQuery(queries.users.find, values, done);
  }, {});

  server.method('users.update', function(values, done) {
    executeQuery(queries.users.update, values, done);
  }, {});

  server.method('users.remove', function(values, done) {
    executeQuery(queries.users.remove, values, done);
  }, {});

  server.method('projects.create', function(values, done) {
    executeQuery(queries.projects.create, values, done);
  }, {});

  server.method('projects.findAll', function(values, done) {
    executeQuery(queries.projects.findAll, values, done);
  }, {});

  server.method('projects.findUsersProjects', function(values, done) {
    executeQuery(queries.projects.findUsersProjects, values, done);
  }, {});

  server.method('projects.findOne', function(values, done) {
    executeQuery(queries.projects.findOne, values, done);
  }, {});

  server.method('projects.findRemixes', function(values, done) {
    executeQuery(queries.projects.findRemixes, values, done);
  }, {});

  server.method('projects.findFeatured', function(values, done) {
    executeQuery(queries.projects.findFeatured, values, done);
  }, {});

  server.method('projects.update', function(values, done) {
    executeQuery(queries.projects.update, values, done);
  }, {});

  server.method('projects.feature', function(values, done) {
    executeQuery(queries.projects.feature, values, done);
  }, {});

  server.method('projects.remove', function(values, done) {
    executeQuery(queries.projects.remove, values, done);
  }, {});

  done();
};

exports.register.attributes = {
  name: 'webmaker-postgre-adapter',
  version: '1.0.0'
};
