/* globals Promise */

var Hoek = require('hoek');
var format = require('util').format;
var queries = require('./queries');
var connString = process.env.POSTGRE_CONNECTION_STRING;

Hoek.assert(connString, 'You must provide a connection string to postgre');

module.exports = function (pg) {
  var postgreAdapter = {
    register: function(server, options, done) {
      function getTransactionClient() {
        return new Promise(function(resolve, reject) {
          pg.connect(connString, function(err, client, release) {
            if ( err ) {
              server.debug(err);
              return reject(err);
            }

            server.debug('PG client created', client);
            resolve({
              client: client,
              release: release
            });
          });
        });
      }

      function begin(transaction) {
        return new Promise(function(resolve, reject) {
          transaction.client.query('BEGIN', function(err, result) {
            if ( err ) {
              server.debug('Failed to begin transaction', err);
              return reject(err);
            }

            server.debug('Transaction started');
            resolve(result);
          });
        });
      }

      function executeTransaction(transaction, text, values) {
        return new Promise(function(resolve, reject) {
          server.debug(format('Executing Transaction Query: %s - params: %s', text, values.join(', ')));
          transaction.client.query({
            text: text,
            values: values
          }, function(err, result) {
            if ( err ) {
              server.debug('Query Execution Failed', err);
              return reject(err);
            }

            server.debug('Transaction Query completed successfully');
            resolve(result);
          });
        });
      }

      function commit(transaction) {
        return new Promise(function(resolve, reject) {
          transaction.client.query('COMMIT', function(err, result) {
            if ( err ) {
              server.debug('Failed to commit transaction', err);
              return reject(err);
            }

            server.debug('Transaction committed to db, releasing connection to pool');
            transaction.release();
            resolve(result);
          });
        });
      }


      function rollback(transaction) {
        return new Promise(function(resolve, reject) {
          transaction.client.query('ROLLBACK', function(err, result) {
            transaction.release();
            if ( err ) {
              server.debug('Transaction rollback failed', err);
              return reject(err);
            }

            server.debug('Transaction rolled back');
            resolve(result);
          });
        });
      }

      function executeQuery(text, values, callback) {
        server.debug(format('Executing Query: %s - params: %s', text, values.join(', ')));
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
              server.debug('Error executing query', err);
              return callback(err);
            }

            server.debug('Query succeeded', result);
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
        var project;
        var page;
        var transaction;
        var transactionErr;

        getTransactionClient().then(function(t) {
          transaction = t;
          return begin(transaction);
        }).then(function() {
          return executeTransaction(transaction, queries.projects.create, values);
        }).then(function(result) {
          project = result.rows[0];
          return executeTransaction(transaction, queries.pages.create, [
            project.id,
            0,
            0,
            '{}'
          ]);
        }).then(function(result) {
          page = result.rows;
          return commit(transaction);
        }).then(function() {
          done(null, {
            project: project,
            page: page
          });
        })
        .catch(function(err) {
          transactionErr = err;
          return rollback(transaction);
        }).then(function() {
          done(transactionErr);
        }).catch(function(err) {
          done(err);
        });
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

      server.method('projects.updateThumbnail', function(values, done) {
        executeQuery(queries.projects.updateThumbnail, values, done);
      }, {});

      server.method('projects.feature', function(values, done) {
        executeQuery(queries.projects.feature, values, done);
      }, {});

      server.method('projects.remove', function(values, done) {
        executeQuery(queries.projects.remove, values, done);
      }, {});

      server.method('pages.create', function(values, done) {
        executeQuery(queries.pages.create, values, done);
      }, {});

      server.method('pages.findAll', function(values, done) {
        executeQuery(queries.pages.findAll, values, done);
      }, {});

      server.method('pages.findOne', function(values, done) {
        executeQuery(queries.pages.findOne, values, done);
      }, {});

      server.method('pages.update', function(values, done) {
        executeQuery(queries.pages.update, values, done);
      }, {});

      server.method('pages.remove', function(values, done) {
        executeQuery(queries.pages.remove, values, done);
      }, {});

      server.method('pages.min', function(values, done) {
        executeQuery(queries.pages.min, values, done);
      });

      server.method('elements.create', function(values, done) {
        executeQuery(queries.elements.create, values, done);
      }, {});

      server.method('elements.findAll', function(values, done) {
        executeQuery(queries.elements.findAll, values, done);
      }, {});

      server.method('elements.findOne', function(values, done) {
        executeQuery(queries.elements.findOne, values, done);
      }, {});

      server.method('elements.update', function(values, done) {
        executeQuery(queries.elements.update, values, done);
      }, {});

      server.method('elements.remove', function(values, done) {
        executeQuery(queries.elements.remove, values, done);
      }, {});

      // expose so tests can stub
      server.expose('pg', pg);

      done();
    }
  };

  postgreAdapter.register.attributes = {
    name: 'webmaker-postgre-adapter',
    version: '1.0.0'
  };

  return postgreAdapter;
};
