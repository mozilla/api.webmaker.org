var requestLogging = require('../lib/request-log');

exports.register = function logger(server, options, next) {
  requestLogging(server);
  next();
};

exports.register.attributes = {
  name: 'webmaker-logger',
  version: '1.0.0'
};
