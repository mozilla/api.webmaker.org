var Hoek = require('hoek');
var boom = require('boom');
var FIFTEEN_MINUTES = 1000 * 60 * 15;

exports.register = function(server, options, done) {
  var ratelimit = server.cache({
    cache: 'webmaker-redis-cache',
    segment: 'ratelimit',
    expiresIn: FIFTEEN_MINUTES
  });

  // off by default
  server.expose('enable', false);

  // key on ip by default
  server.expose('generateKeyFunc', function(request) {
    var methodAndPath = request.method + ':' + request.path + ':';
    var ip = request.headers['x-forwarded-for'];

    if ( !ip ) {
      ip = request.info.remoteAddress;
    }

    return methodAndPath + ip;
  });

  // routes can override the TTL by setting this
  server.expose('ttl', FIFTEEN_MINUTES);

  // hits on endpoint per ttl period
  server.expose('limit', 15);

  server.ext('onPostAuth', function(request, reply) {
    var settings = request.route.settings;

    if (
      !settings.plugins ||
      !settings.plugins['webmaker-ratelimit'] ||
      !settings.plugins['webmaker-ratelimit'].enable
    ) {
      return reply.continue();
    }

    var routeSettings = settings.plugins['webmaker-ratelimit'];

    var keyValue = routeSettings.generateKeyFunc(request);

    ratelimit.get(keyValue, function(err, value, cached) {
      if ( err ) {
        return reply(err);
      }
      request.plugins['webmaker-ratelimit'] = {};
      request.plugins['webmaker-ratelimit'].limit = routeSettings.limit;

      if ( !cached ) {
        var reset = Date.now() + routeSettings.ttl;
        return ratelimit.set(keyValue, { remaining: routeSettings.limit }, routeSettings.ttl, function(err) {
          if ( err ) {
            return reply(err);
          }
          request.plugins['webmaker-ratelimit'].remaining = routeSettings.limit;
          request.plugins['webmaker-ratelimit'].reset = reset;
          reply.continue();
        });
      }

      request.plugins['webmaker-ratelimit'].remaining = value.remaining - 1;
      request.plugins['webmaker-ratelimit'].reset = cached.ttl;

      var error;
      if (  request.plugins['webmaker-ratelimit'].remaining < 0 ) {
        error = boom.tooManyRequests('Rate Limit Exceeded');
        error.output.headers['X-Rate-Limit-Limit'] = request.plugins['webmaker-ratelimit'].limit;
        error.output.headers['X-Rate-Limit-Reset'] = request.plugins['webmaker-ratelimit'].reset;
        error.output.headers['X-Rate-Limit-Remaining'] = 0;
        error.reformat();
        return reply(error);
      }

      ratelimit.set(
        keyValue,
        { remaining: request.plugins['webmaker-ratelimit'].remaining },
        request.plugins['webmaker-ratelimit'].reset, function(err) {
        if ( err ) {
          return reply(err);
        }

        reply.continue();
      });
    });
  });

  server.ext('onPostHandler', function(request, reply) {
    var route = request.route;
    var response;
    if (
      route.plugins &&
      route.plugins['webmaker-ratelimit'] &&
      route.plugins['webmaker-ratelimit'].enable
    ) {
      response = request.response;
      if ( !response.isBoom ) {
        response.headers['X-Rate-Limit-Limit'] = request.plugins['webmaker-ratelimit'].limit;
        response.headers['X-Rate-Limit-Remaining'] = request.plugins['webmaker-ratelimit'].remaining;
        response.headers['X-Rate-Limit-Reset'] = request.plugins['webmaker-ratelimit'].reset;
      }
    }

    reply.continue();
  });

  done();
};

exports.register.attributes = {
  name: 'webmaker-ratelimit',
  version: '1.0.0'
};
