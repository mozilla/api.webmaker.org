var bunyan = require('bunyan');

module.exports = function generateConf() {
  return {
    logger: bunyan.createLogger({
      name: 'api-webmaker-org',
      level: process.env.LOG_LEVEL || 'info'
    })
  };
};
