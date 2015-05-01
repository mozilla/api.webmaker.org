var _ = require('lodash');
var userFixtures = require('../fixtures/users');

exports.register = function(server, options, done) {
  server.method('db.createUser', function(values, done) {
    if ( values[0] === 'cade' ) {
      return done({
        constraint: 'unique_username'
      });
    }

    if ( values[0] === 'error' ) {
      return done(new Error('error from pg'));
    }

    done(null, {
      rows:[{
        id: 3
      }]
    });
  }, {});

  server.method('db.findUser', function(values, done) {
    if ( values[0] === 5 ) {
      return done(new Error('error from pg'));
    }

    var user = _.findWhere(userFixtures, { id: values[0] });

    user = user ? [user] : [];

    done(null, {
      rows: user
    });
  }, {});

  server.method('db.updateUser', function(values, done) {
    if ( values[0] === 'error' ) {
      return done(new Error('error from pg'));
    }

    done(null, {
      rows:[{
        username: values[0] || 'unchanged',
        language: values[1] || 'en',
        country: values[2] || 'CA'
      }]
    });
  }, {});

  server.method('db.deleteUser', function(values, done) {
    if ( values[0] === 2 ) {
      return done(new Error('error from pg'));
    }

    done(null);
  }, {});

  done();
};

exports.register.attributes = {
  name: 'mock-webmaker-postgre-adapter',
  version: '1.0.0'
};
