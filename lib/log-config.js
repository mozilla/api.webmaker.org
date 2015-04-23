var logConf = {
  console: {
    color: true
  },
  level: process.env.LOG_LEVEL || 'info'
};

if ( process.env.LOG_FILE_PATH ) {
  logConf.file = {
    filename: process.env.LOG_FILE_PATH,
    format: ':level :time :data',
    timestamp: 'HH:mm:ss',
    accessFormat: ':time :level :method :status :url'
  };
}

module.exports = logConf;
