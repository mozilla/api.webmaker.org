const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    debug: process.env.DEBUG == true,
    connection: 'postgresql://localhost:5432/webmaker',
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  }
};
