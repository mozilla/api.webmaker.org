exports.register = function api(server, options, next) {
  server.route(require('./routes'));
  next();
};

exports.register.attributes = {
  name: 'webmaker-api-service',
  version: '1.0.0'
};
