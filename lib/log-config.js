module.exports = function generateConf() {
  var logConf = {
    level: process.env.LOG_LEVEL || 'info'
  };

  if ( process.env.NO_CONSOLE !== 'true' ) {
    logConf.console = {
      color: true
    };
  }

  return logConf;
};
