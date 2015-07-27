const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    debug: process.env.DEBUG == true,
    connection: 'postgresql://localhost:5432/webmaker',
    directory: path.resolve(__dirname, '../migrations_knex'),
    migrations: {
      tableName: 'migrations'
    }
  }
};
