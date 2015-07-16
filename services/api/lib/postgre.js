var Hoek = require('hoek');
var Boom = require('boom');
var BPromise = require('bluebird');
var format = require('util').format;
var queries = require('./queries');
var connString = process.env.POSTGRE_CONNECTION_STRING;

Hoek.assert(connString, 'You must provide a connection string to postgre');

module.exports = function (pg) {
  var postgreAdapter = {
    register: function(server, options, done) {
      function getTransactionClient() {
        return new BPromise(function(resolve, reject) {
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
        return new BPromise(function(resolve, reject) {
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
        return new BPromise(function(resolve, reject) {
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
        return new BPromise(function(resolve, reject) {
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
        return new BPromise(function(resolve, reject) {
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
      }, {
        cache: {
          segment: 'users.find',
          expiresIn: 1000 * 60 * 60 * 24,
          staleIn: 1000 * 60 * 60 * 12,
          staleTimeout: 50
        },
        generateKey: function(args) {
          // user ID
          return '' + args[0];
        }
      });

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

        getTransactionClient().then(function(t) {
          transaction = t;
          return begin(transaction);
        }).then(function() {
          return executeTransaction(transaction, queries.projects.create, values);
        }).then(function(result) {
          project = result.rows[0];
          return executeTransaction(transaction, queries.pages.create, [
            project.id,
            project.user_id,
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
        }).catch(function(err) {
          if ( transaction ) {
            return rollback(transaction)
              .then(function() {
                done(err);
              }).catch(function(rollbackErr) {
                done(rollbackErr);
              });
          }

          done(err);
        });
      }, {});

      server.method('projects.remix', function(userId, dataToRemix, done) {
        var remixedProject;
        var remixedElements;
        var remixedPages;
        var transaction;

        getTransactionClient().then(function(t) {
          transaction = t;
          return begin(transaction);
        }).then(function() {
          return executeTransaction(transaction, queries.projects.create,
            [
              userId,
              dataToRemix.id,
              server.methods.utils.version(),
              dataToRemix.title,
              dataToRemix.thumbnail
            ]
          );
        }).then(function(result) {
          remixedProject = result.rows[0];
          remixedPages = [];
          remixedElements = [];
          return BPromise.resolve(dataToRemix.pages.map(function(page) {
            return new BPromise(function(resolve, reject) {
              var remixPage;
              executeTransaction(transaction, queries.pages.create,
                [
                  remixedProject.id,
                  userId,
                  page.x,
                  page.y,
                  page.styles
                ]
              ).then(function(result) {
                remixPage = result.rows[0];
                remixedPages.push(remixPage);
                return BPromise.resolve(page.elements.map(function(element) {
                  if ( element.type === 'link' ) {
                    element.attributes.targetProjectId = remixedProject.id;
                    element.attributes.targetUserId = userId;
                  }
                  return executeTransaction(transaction, queries.elements.create,
                    [
                      remixPage.id,
                      userId,
                      element.type,
                      element.attributes,
                      element.styles
                    ]
                  );
                }));
              }).then(function(elementPromises) {
                return BPromise.all(elementPromises);
              }).then(function(results) {
                remixedElements.push.apply(remixedElements, results.map(function(result) {
                  return result.rows[0];
                }));
                resolve();
              }).catch(reject);
            });
          }));
        }).then(function(pagePromises) {
          return BPromise.all(pagePromises);
        }).then(function() {
          var remixLinks = remixedElements.filter(function(elem) {
            return elem.type === 'link';
          });
          return BPromise.resolve(remixLinks.map(function(link) {
            var targetX;
            var targetY;
            var foundTargetPage = dataToRemix.pages.some(function(page) {
              if ( page.id === link.attributes.targetPageId ) {
                targetX = page.x;
                targetY = page.y;
                return true;
              }
              return false;
            });

            if ( !foundTargetPage ) {
              delete link.attributes.targetPageId;
            } else {
              remixedPages.some(function(page) {
                if ( page.x === targetX && page.y === targetY ) {
                  link.attributes.targetPageId = page.id;
                  return true;
                }
                return false;
              });
            }

            return executeTransaction(transaction, queries.elements.update,
              [
                link.styles,
                link.attributes,
                link.id
              ]
            );
          }));
        }).then(function(linkPromises) {
          return BPromise.all(linkPromises);
        }).then(function() {
          return commit(transaction);
        }).then(function() {
          done(null, remixedProject);
        }).catch(function(err) {
          if ( transaction ) {
            return rollback(transaction)
              .then(function() {
                done(err);
              }).catch(function(rollbackErr) {
                done(rollbackErr);
              });
          }
          done(err);
        });
      });

      var reachRegex = /^\$(\d+)\.(.*)$/;

      function getValuesForQuery(userId, type, method, data) {
        var values;
        switch (type) {
          case 'projects': {
            switch (method) {
              case 'create': {
                values = [
                  userId,
                  null,
                  server.methods.utils.version(),
                  data.title,
                  JSON.stringify(data.thumbnail || {})
                ];
                break;
              }
              case 'update': {
                values = [
                  data.title,
                  data.id
                ];
                break;
              }
              case 'remove': {
                values = [
                  data.id
                ];
                break;
              }
            }
            break;
          }
          case 'pages': {
            switch (method) {
              case 'create': {
                values = [
                  data.projectId,
                  data.x,
                  data.y,
                  JSON.stringify(data.styles || {})
                ];
                break;
              }
              case 'update': {
                values = [
                  data.x,
                  data.y,
                  JSON.stringify(data.styles || {}),
                  data.id
                ];
                break;
              }
              case 'remove': {
                values = [
                  data.id
                ];
                break;
              }
            }
            break;
          }
          case 'elements': {
            switch (method) {
              case 'create': {
                values = [
                  data.pageId,
                  data.type,
                  JSON.stringify(data.attributes || {}),
                  JSON.stringify(data.styles || {})
                ];
                break;
              }
              case 'update': {
                values = [
                  JSON.stringify(data.styles || {}),
                  JSON.stringify(data.attributes || {}),
                  data.id
                ];
                break;
              }
              case 'remove': {
                values = [
                  data.id
                ];
                break;
              }
            }
          }
        }
        return values;
      }

      server.method('projects.bulk', function(actions, userId, done) {
        var transaction;
        var transactionResults;
        getTransactionClient()
        .then(function(t) {
          transaction = t;
          return begin(transaction);
        })
        .then(function() {
          return BPromise.resolve(actions);
        })
        .reduce(function(results, action, actionIndex) {
          return new BPromise(function(resolve, reject) {
            var failureData;
            var errorReason;
            var shouldReject = !Object.keys(action.data).every(function(key) {
              var reachString;
              var valid = true;
              if ( !reachRegex.test(action.data[key]) ) {
                return true;
              }
              action.data[key] = action.data[key].replace(reachRegex, function($1, $2, $3) {
                var reachIdx = +$2;
                var value;
                reachString = $3;
                if ( reachIdx <= results.length ) {
                  value = Hoek.reach(results[reachIdx], reachString);
                } else {
                  errorReason = 'Array reference out of bounds for ' + key + ' in action at index ' + actionIndex;
                  failureData = {
                    key: key,
                    reachIdx: reachIdx,
                    actionIndex: actionIndex
                  };
                  valid = false;
                  return;
                }

                if ( !value ) {
                  errorReason = 'Invalid reference to value using key \'' +
                    key +
                    '\' in action at index ' +
                    actionIndex;
                  failureData = {
                    key: key,
                    reachIdx: reachIdx,
                    actionIndex: actionIndex
                  };
                  valid = false;
                  return;
                }

                return value;
              });

              return valid;
            });

            if ( shouldReject ) {
              return reject(Boom.badRequest(
                errorReason,
                failureData
              ));
            }

            var query = queries[action.type][action.method];
            var values = getValuesForQuery(userId, action.type, action.method, action.data);

            executeTransaction(transaction, query, values)
            .then(function(result) {
              if ( action.method === 'remove' ) {
                results.push({
                  status: 'deleted'
                });
                return resolve(results);
              }
              switch (action.type) {
                case 'projects': {
                  if ( action.method === 'create' ) {
                    result = server.methods.utils.formatProject(result.rows[0]);
                    break;
                  }
                  result = server.methods.utils.formatProject(result.rows[0]);
                  break;
                }
                case 'pages': {
                  result = server.methods.utils.formatPage(result.rows);
                  break;
                }
                case 'elements': {
                  result = result.rows[0];
                }
              }
              results.push(result);
              resolve(results);
            })
            .catch(function(err) {
              reject(Boom.badRequest(
                'failed to execute query for action at index ' + actionIndex,
                {
                  err: err.toString(),
                  action: action
                }
              ));
            });
          });
        }, [])
        .then(function(results) {
          transactionResults = results;
          return commit(transaction);
        })
        .then(function() {
          done(null, transactionResults);
        })
        .catch(function(err) {
          if ( transaction ) {
            return rollback(transaction)
              .then(function() {
                done(err);
              }).catch(function(rollbackErr) {
                done(rollbackErr);
              });
          }

          done(err);
        });
      }, {});

      server.method('projects.findAll', function(values, done) {
        executeQuery(queries.projects.findAll, values, done);
      }, {
        cache: {
          segment: 'projects.findAll',
          expiresIn: 1000 * 15
        },
        generateKey: function(args) {
          // count + offset
          return args.join('.');
        }
      });

      server.method('projects.findUsersProjects', function(values, done) {
        executeQuery(queries.projects.findUsersProjects, values, done);
      }, {
        cache: {
          segment: 'projects.findUsersProjects',
          expiresIn: 1000 * 60
        },
        generateKey: function(args) {
          // user ID + limit + offset
          return args.join('.');
        }
      });

      server.method('projects.findOne', function(values, done) {
        executeQuery(queries.projects.findOne, values, done);
      }, {
        cache: {
          segment: 'projects.findOne',
          expiresIn: 1000 * 60 * 5,
          staleIn: 1000 * 60,
          staleTimeout: 50
        },
        generateKey: function(args) {
          // project ID + user ID
          return args.join('.');
        }
      });

      server.method('projects.findRemixes', function(values, done) {
        executeQuery(queries.projects.findRemixes, values, done);
      }, {
        cache: {
          segment: 'projects.findRemixes',
          expiresIn: 1000 * 15
        },
        generateKey: function(args) {
          // project ID + user ID
          return args.join('.');
        }
      });

      server.method('projects.findDataForRemix', function(values, done) {
        executeQuery(queries.projects.findDataForRemix, values, done);
      }, {
        cache: {
          segment: 'projects.findDataForRemix',
          expiresIn: 1000 * 60 * 5,
          staleIn: 1000 * 60,
          staleTimeout: 100
        },
        generateKey: function(args) {
          // project ID
          return '' + args[0];
        }
      });

      server.method('projects.findFeatured', function(values, done) {
        executeQuery(queries.projects.findFeatured, values, done);
      }, {
        cache: {
          segment: 'projects.findFeatured',
          expiresIn: 1000 * 60 * 60,
          staleIn: 1000 * 60 * 5,
          staleTimeout: 100
        },
        generateKey: function(args) {
          // count + offset
          return args.join('.');
        }
      });

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
      }, {
        cache: {
          segment: 'pages.findAll',
          expiresIn: 1000 * 60,
          staleIn: 1000 * 30,
          staleTimeout: 100
        },
        generateKey: function(args) {
          // projectId
          return '' + args[0];
        }
      });

      server.method('pages.findOne', function(values, done) {
        executeQuery(queries.pages.findOne, values, done);
      }, {
        cache: {
          segment: 'pages.findOne',
          expiresIn: 1000 * 60,
          staleIn: 1000 * 30,
          staleTimeout: 100
        },
        generateKey: function(args) {
          return args.join('.');
        }
      });

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
      }, {
        cache: {
          segment: 'elements.findAll',
          expiresIn: 1000 * 60,
          staleIn: 1000 * 30,
          staleTimeout: 100
        },
        generateKey: function(args) {
          // pageId
          return '' + args[0];
        }
      });

      server.method('elements.findOne', function(values, done) {
        executeQuery(queries.elements.findOne, values, done);
      }, {
        cache: {
          segment: 'elements.findOne',
          expiresIn: 1000 * 60,
          staleIn: 1000 * 30,
          staleTimeout: 100
        },
        generateKey: function(args) {
          // elementId
          return '' + args[0];
        }
      });

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
