const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: 'postgresql://localhost:5432/webmaker',
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  },
  testing: {
    client: 'pg',
    debug: true,
    connection: 'postgresql://localhost:5432/webmaker-testing',
    directory: './migrations',
    migrations: {
      tableName: 'migraitons'
    }
  },
  production: {
    client: 'pg',
    debug: false,
    connection: 'postgresql://localhost:5432/webmaker',
    directory: './migrations',
    migrations: {
      tableName: 'migrations'
    }
  }
};
