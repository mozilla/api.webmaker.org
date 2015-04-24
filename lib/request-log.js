var format = require('util').format;

module.exports = function(server) {
  server.on('request-internal', function(request, event, tags) {
    if ( tags.received ) {
      logRequest(request);
    } else if ( tags.response ) {
      logResponse(request);
    }
  });

  function logRequest(request) {
    var logString = format(
      'Incoming request: %s %s @ %s',
      request.method.toUpperCase(),
      request.path,
      (new Date()).toUTCString()
    );

    server.methods.log('info', logString);

    server.methods.log('debug', JSON.stringify({
      event: 'request',
      id: request.id,
      instance: request.connection.info.uri,
      method: request.method,
      path: request.path,
      query: request.query
    }, null, 2));
  }

  function logResponse(request) {
    server.methods.log('info', format(
      'Outgoing response: %s %s %d - %s',
      request.method.toUpperCase(),
      request.path,
      request.raw.res.statusCode,
      (new Date().toUTCString())
    ));

    server.methods.log('debug', JSON.stringify({
      event: 'response',
      timestamp: request.info.received,
      instance: request.connection.info.uri,
      method: request.method,
      path: request.path,
      query: request.query,
      responseTime: Date.now() - request.info.received,
      statusCode: request.raw.res.statusCode,
      source: {
        remoteAddress: request.info.remoteAddress,
        userAgent: request.headers['user-agent'],
        referer: request.headers.referer
      },
      log: request.getLog(),
      headers: request.headers
    }, null, 2));
  }
};
