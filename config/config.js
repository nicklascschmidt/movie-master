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
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL'
  }
};



// // INITIATE CONNECTION TO MYSQL

// const Sequelize = require("sequelize");

// // Creates mySQL connection using Sequelize, the empty string in the third argument spot is our password.
// const sequelize = new Sequelize("MovieMaster_db", "root", "", {
//   host: "localhost",
//   port: 3306,
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000
//   }
// });

// // Exports the connection for other files to use
// module.exports = sequelize;
