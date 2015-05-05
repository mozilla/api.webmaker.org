/* global Promise */

var _ = require('lodash');
var userFixtures = require('../fixtures/users');

exports.register = function(server, options, done) {
  function mockErr() {
    var e = new Error('relation does not exist');
    e.name = 'error';
    e.severity = 'ERROR';
    e.code = '42P01';
    return e;
  }

  server.method('users.create', function(values, done) {
    return new Promise(function(resolve, reject) {
      if ( values[0] === 'cade' ) {
        return reject({
          constraint: 'unique_username'
        });
      }

      if ( values[0] === 'error' ) {
        return reject(mockErr());
      }

      resolve({
        rows:[{
          id: 3
        }]
      });
    });
  }, {});

  server.method('users.find', function(values, done) {
    return new Promise(function(resolve, reject) {
      if ( values[0] === 5 ) {
        return reject(mockErr());
      }

      var user = _.findWhere(userFixtures, { id: values[0] });
      user = user ? [user] : [];

      resolve({
        rows: user
      });
    });
  }, {});

  server.method('users.update', function(values, done) {
    return new Promise(function(resolve, reject) {
      if ( values[0] === 'error' ) {
        return reject(mockErr());
      }

      resolve({
        rows:[{
          username: values[0] || 'unchanged',
          language: values[1] || 'en',
          country: values[2] || 'CA'
        }]
      });
    });
  }, {});

  server.method('users.remove', function(values, done) {
    return new Promise(function(resolve, reject) {
      if ( values[0] === 2 ) {
        return reject(mockErr());
      }

      resolve();
    });
  }, {});

  done();
};

exports.register.attributes = {
  name: 'mock-webmaker-postgre-adapter',
  version: '1.0.0'
};
