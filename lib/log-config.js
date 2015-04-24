module.exports = function generateConf() {
  console.log( process.env.LOG_LEVEL );
  var logConf = {
    level: process.env.LOG_LEVEL || 'info'
  };

  if ( process.env.NO_CONSOLE !== 'true' ) {
    logConf.console = {
      color: true
    };
  }

  if ( process.env.LOG_FILE_PATH ) {
    logConf.file = {
      filename: process.env.LOG_FILE_PATH,
      format: ':level :time :data',
      timestamp: 'HH:mm:ss',
      accessFormat: ':time :level :method :status :url'
    };
  }

  return logConf;
};
