'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: [3,30]
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: [5,30]
      }
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Movie);
  };

  return User
};