const db = require("../models");

// Defines methods for the userController
module.exports = {
  // Add user
  create: function(req,res) {
    db.User
      .create(req.body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // Check user login credentials
  findOne: function(req,res) {
    db.User
      .findOne({ where: req.query })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  }
};
