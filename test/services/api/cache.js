require('habitat').load('tests.env');

var Lab = require('lab'),
  Hapi = require('hapi'),
  sinon = require('sinon'),
  redisUrl = require('redis-url'),
  lab = exports.lab = Lab.script(),
  experiment = lab.experiment,
  before = lab.before,
  after = lab.after,
  test = lab.test,
  expect = require('code').expect,
  server;

var redisClient = redisUrl.connect(process.env.REDIS_URL);

before(function(done) {
  var redis = redisUrl.parse(process.env.REDIS_URL);
  server = new Hapi.Server({
    cache: {
      engine: require('catbox-redis'),
      host: redis.hostname,
      port: redis.port,
      password: redis.password
    }
  });
  server.connection();
  server.decorate('server', 'debug', function() {});
  server.method('cache.segment', function(values, done) {}, {
    cache: {
      segment: 'cache.segment'
    },
    generateKey: function(args) {
      return args.join('.');
    }
  });

  server.register([
    require('../../../services/api/lib/cache')
  ], function(err) {
    expect(err).to.be.undefined();
    server.start(done);
  });
});

after(function(done) {
  server.stop(done);
});

experiment('Cache Invalidation', function() {
  experiment('invalidateKey', function() {
    var cacheKey = 'hapi-cache:cache.segment:1';
    before(function(done) {
      redisClient.set(cacheKey, 'value', function(err) {
        expect(err).to.be.null();
        done();
      });
    });

    test('drops a key', function(done) {
      server.methods.cache.invalidateKey('cache', 'segment', 1, function() {
        redisClient.get(cacheKey, function(err, result) {
          expect(err).to.be.null();
          expect(result).to.be.null();
          done();
        });
      });
    });

    test('drops a key, array as third arg', function(done) {
      server.methods.cache.invalidateKey('cache', 'segment', [1], function() {
        redisClient.get(cacheKey, function(err, result) {
          expect(err).to.be.null();
          expect(result).to.be.null();
          done();
        });
      });
    });
  });

  experiment('InvalidateKeys for a specific id', function() {
    var cacheKey = 'hapi-cache:cache.segment:1';
    before(function(done) {
      var multi = redisClient.multi();
      var i;
      var j;
      for (i = 0; i <= 10; i++) {
        for (j = 0; j <= 10; j++) {
          multi.set(cacheKey + '.' + i + '.' + j, 'value');
        }
      }
      multi.exec(function(err) {
        expect(err).to.be.null();
        done();
      });
    });

    test('drops keys', function(done) {
      server.methods.cache.invalidateKeys('cache', 'segment', 1, function() {
        var multi = redisClient.multi();
        var i;
        var j;
        for (i = 0; i <= 10; i++) {
          for (j = 0; j <= 10; j++) {
            multi.get(cacheKey + '.' + i + '.' + j);
          }
        }
        multi.exec(function(err, results) {
          expect(err).to.be.null();
          expect(results.every(function(result) {
            return result === null;
          })).to.be.true();
          done();
        });
      });
    });
  });

  experiment('InvalidateKeys without an id argument', function() {
    var cacheKey = 'hapi-cache:cache.segment:';
    before(function(done) {
      var multi = redisClient.multi();
      var i;
      var j;
      for (i = 0; i <= 10; i++) {
        for (j = 0; j <= 10; j++) {
          multi.set(cacheKey + i + '.' + j, 'value');
        }
      }
      multi.exec(function(err) {
        expect(err).to.be.null();
        done();
      });
    });

    test('drops keys', function(done) {
      server.methods.cache.invalidateKeys('cache', 'segment', function() {
        var multi = redisClient.multi();
        var i;
        var j;
        for (i = 0; i <= 10; i++) {
          for (j = 0; j <= 10; j++) {
            multi.get(cacheKey + i + '.' + j);
          }
        }
        multi.exec(function(err, results) {
          expect(err).to.be.null();
          expect(results.every(function(result) {
            return result === null;
          })).to.be.true();
          done();
        });
      });
    });
  });

  experiment('Errors', function() {
    test('logs errors from server methods', function(done) {
      var stub = sinon.stub(server.methods.cache.segment.cache, 'drop')
        .callsArgWith(1, new Error('test error'));

      server.once('log', function (event, tags) {
        expect(tags.error).to.be.true();
        expect(event.data.message).to.equal('failed to invalidate cache for: cache.segment:1');
        stub.restore();
        done();
      });

      server.methods.cache.invalidateKey('cache', 'segment', [1], function() {});
    });
  });

  test('logs errors from redisClient.keys', function(done) {
    var stub = sinon.stub(server.plugins['webmaker-cache-utils'].client, 'keys')
      .callsArgWith(1, new Error('test error'));

    server.once('log', function (event, tags) {
      expect(tags.error).to.be.true();
      expect(event.data.message).to.equal('failed to get keys for: hapi-cache:cache.segment:1.*.*');
      stub.restore();
      done();
    });

    server.methods.cache.invalidateKeys('cache', 'segment', 1, function() {});
  });
});
