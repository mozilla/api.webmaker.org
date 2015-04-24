var requestLogging = require('../lib/request-log');

var LOG_LEVELS = {
  debug: {
    level: 0
  },
  info: {
    level: 1
  },
  warn: {
    level: 2
  },
  error: {
    level: 3
  },
  exception: {
    level: 4
  },
  stat: {
    level: 5
  }
};

var logLevel = process.env.LOG_LEVEL;

logLevel = LOG_LEVELS[logLevel] ? LOG_LEVELS[logLevel] : LOG_LEVELS.info.level;

exports.register = function logger(server, options, next) {
  server.method('log', function(level, data) {
    if ( logLevel >= LOG_LEVELS[level] ) {
      server.log(level, data);
    }
  }, { callback: false });

  requestLogging(server);
  next();
};

exports.register.attributes = {
  name: 'webmaker-logger',
  version: '1.0.0'
};
