const path = require('path')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, '.', 'database.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, 'database', 'knex', 'migrations')
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb)
    },
  },
};
