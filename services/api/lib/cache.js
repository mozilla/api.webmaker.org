/* globals Promise */

exports.register = function(server, options, next) {
  var client = require('redis-url').connect(process.env.REDIS_URL);

  // we're using the default cache name hapi creates
  var cacheName = 'hapi-cache';

  function debug(data) {
    server.debug({
      message: 'invalidating cache',
      data: data
    });
  }

  function error(message, err) {
    server.log('error', {
      message: message,
      error: err
    });
  }

  function invalidateKey(type, funcName, keys, done) {
    if ( !Array.isArray(keys) ) {
      keys = [keys];
    }

    process.nextTick(function() {
      debug({
        type: type,
        funcName: funcName,
        keys: keys
      });

      server.methods[type][funcName].cache.drop(keys, function(err) {
        if ( err ) {
          error('failed to invalidate cache for: ' + type + '.' + funcName + ':'  + keys.join('.'), err);
        }
        done();
      });
    });
  }

  function getInvalidationPromises(type, funcName, keysToDrop) {
    return keysToDrop.map(function(keys) {
      return new Promise(function(resolve, reject) {
        invalidateKey(type, funcName, keys, resolve);
      });
    });
  }

  function invalidateKeys(type, funcName, id, tail) {
    process.nextTick(function() {
      if ( typeof id === 'function' ) {
        tail = id;
        id = '*.*';
      } else {
        id += '.*.*';
      }

      var key = [
        cacheName,
        type + '.' + funcName,
        id
      ].join(':');

      client.keys(key, function(err, result) {
        if ( err ) {
          error('failed to get keys for: ' + key, err);
          return tail();
        }

        var keysToDrop = result.map(function(key) {
          return key.split(':').pop().split('.');
        });

        Promise.all(getInvalidationPromises(type, funcName, keysToDrop)).then(tail);
      });
    });
  }

  server.method('cache.invalidateKey', invalidateKey, { callback: false });
  server.method('cache.invalidateKeys', invalidateKeys, { callback: false });
  server.expose('client', client);
  next();
};

exports.register.attributes = {
  name: 'webmaker-cache-utils'
};
