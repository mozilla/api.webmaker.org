const path = require('path');
require('habitat').load(process.argv[3]);

module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: process.env.POSTGRE_CONNECTION_STRING,
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  }
};
