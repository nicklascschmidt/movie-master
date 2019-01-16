'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    // imdbUrl: {
    //   type: DataTypes.STRING
    // },
    // year: {
    //   type: DataTypes.INTEGER
    // },
    // maturityRating: {
    //   type: DataTypes.STRING
    // },
    // lengthInMinutes: {
    //   type: DataTypes.INTEGER
    // },
    // imdbRating: {
    //   type: DataTypes.INTEGER
    // },
    // plot: {
    //   type: DataTypes.TEXT,
    //   validate: {
    //     len: [0,2000]
    //   }
    // },
    // director: {
    //   type: DataTypes.STRING
    // },
    // actors: {
    //   type: DataTypes.ARRAY(DataTypes.STRING)
    // },


    isWatched: {
      type: DataTypes.BOOLEAN
    }

  });

  Movie.associate = function(models) {
    models.Movie.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Movie
};