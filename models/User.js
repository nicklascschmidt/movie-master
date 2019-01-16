'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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

  // User.associate = function(models) {
  //   models.User.hasMany(models.Task);
  // };

  return User
};