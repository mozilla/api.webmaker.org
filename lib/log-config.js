var bunyan = require('bunyan');
var PrettyStream;
var stream;

var loggerSettings = {
  name: 'api-webmaker-org',
  level: process.env.LOG_LEVEL
};

if ( process.env.NODE_ENV !== 'production' ) {
  PrettyStream = require('bunyan-prettystream');
  stream = new PrettyStream();
  stream.pipe(process.stdout);
  loggerSettings.stream = stream;
}

module.exports = function generateConf() {
  return {
    logger: bunyan.createLogger(loggerSettings)
  };
};
