var newrelic = require('newrelic');

exports.register = function(server, options, done) {
  var createTracer;

  if (!newrelic.createTracer) {
    // NOP
    createTracer = function() {};
  } else {
    createTracer = newrelic.createTracer.bind(newrelic);
  }

  server.method('newrelic.createTracer', createTracer, {
    callback: false
  });

  done();
};

exports.register.attributes = {
  name: 'newrelic-tracer'
};
