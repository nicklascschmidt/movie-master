'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('Movie', {
    title: {
      type: DataTypes.STRING,
    },
    imdbUrl: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
      // validate: {
      //   len: [5,30]
      // }
    },

  });

  // User.associate = function(models) {
  //   models.User.hasMany(models.Task);
  // };

  return Movie
};