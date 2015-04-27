module.exports = function generateConf() {
  var logConf = {
    level: process.env.LOG_LEVEL || 'info'
  };

  if ( process.env.NO_CONSOLE !== 'true' ) {
    logConf.console = {
      color: true
    };
  }

  if ( process.env.LOG_FILE_PATH && process.env.LOG_FILENAME ) {
    logConf.app = process.env.LOG_FILENAME;

    // log errors separately?
    if ( process.env.ERROR_FILENAME ) {
      logConf.error = process.env.ERROR_FILENAME;
    }

    logConf.file = {
      filename: process.env.LOG_FILE_PATH,
      format: ':level :time :data',
      timestamp: 'HH:mm:ss',
      accessFormat: ':time :level :method :status :url'
    };
  }

  return logConf;
};
