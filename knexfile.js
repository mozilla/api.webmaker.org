const path = require('path');
require('habitat').load();

module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: process.env.POSTGRE_CONNECTION_STRING,
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  },
  testing: {
    client: 'pg',
    debug: true,
    connection: process.env.POSTGRE_CONNECTION_STRING,
    directory: './migrations',
    migrations: {
      tableName: 'migraitons'
    }
  },
  production: {
    client: 'pg',
    debug: false,
    connection: process.env.POSTGRE_CONNECTION_STRING,
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  }
};
