module.exports = {
  development: {
    username: 'root',
    password: '',
    database: 'MovieMaster_db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: '',
    database: 'MovieMaster_db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'bd68e02d14da2f',
    password: 'd3080578',
    database: 'heroku_1bc712f3efe9b0f',
    host: 'us-cdbr-iron-east-01.cleardb.net',
    dialect: 'mysql'
  }
  // production: {
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_NAME,
  //   host: process.env.DB_HOSTNAME,
  //   dialect: 'mysql',
  //   use_env_variable: 'DATABASE_URL'
  // }
};
