const db = require("../models");

// Defining methods for the userController
module.exports = {
  findOne: function(req,res) {
    db.User
      .findOne({ where: req.query })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  create: function(req,res) {
    console.log('\n\n\n\nreq.body',req.body);
    db.User
      .create(req.body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },


  findAll: function(req, res) {
    console.log('req.query',req.query);
    db.User
      // .find({ where: req.query })
      .findAll()
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.User
      .findById(req.params.id)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
};
