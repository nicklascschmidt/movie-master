'use strict';
module.exports = (sequelize, DataTypes) => {
  var Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,300]
      }
    },
    imdbUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,1000]
      }
    },
    posterUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,1000]
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    maturityRating: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,10]
      }
    },
    lengthInMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imdbRating: {
      type: DataTypes.DECIMAL(10,1),
      allowNull: false,
    },
    plot: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0,2000]
      }
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,100]
      }
    },
    actors: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0,500]
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0,100]
      }
    },

    isWatched: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    userRating: {
      type: DataTypes.DECIMAL(10,1),
      allowNull: true
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