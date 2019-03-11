const db = require("../models");

// Defining methods for the articleController
module.exports = {
  // Find movies (watched || unwatched), sort by most recently updated.
  findAll: function(req, res) {
    db.Movie
      .findAll({ where: req.query, order: [['updatedAt','DESC']] })
      .then(dbMovies => res.json(dbMovies))
      .catch(err => res.status(422).json(err));
  },
  // Deletes movie from DB
  remove: function(req, res) {
    console.log('\n\nreq.params',req.params,'\n\n')
    db.Movie
      .destroy({ where: req.params })
      .then(deletedResp => res.json(deletedResp))
      .catch(err => res.status(422).json(err));
  },
  // Updates isWatched to the opposite (bool)
  updateWatched: function(req, res) {
    let id = { id: req.params.id };
    let opposite = req.body.isWatched === 'true' ? false : true;
    db.Movie
      .update( { isWatched: opposite }, { where: id })
      .then( data => res.json(data))
      .catch(err => res.status(422).json(err));
  },

  updateRating: function(req, res) {
    console.log('\n\nreq.params',req.params,'\n\n');
    console.log('\n\nreq.body',req.body,'\n\n');

    let id = { id: req.params.id };
    db.Movie
      .update( { userRating: req.body.rating }, { where: id })
      .then( data => res.json(data))
      .catch(err => res.status(422).json(err));
  },



  // Add user
  VOIDcreate: function(req,res) {
    db.User
      .create(req.body)
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  },
  // Check user login credentials
  VOIDfindOne: function(req,res) {
    db.User
      .findOne({ where: req.query })
      .then(dbUser => res.json(dbUser))
      .catch(err => res.status(422).json(err));
  }




  // findById: function(req, res) {
  //   db.Movie
  //     .findById(req.params.id)
  //     .then(dbMovie => res.json(dbMovie))
  //     .catch(err => res.status(422).json(err));
  // },
  // create: function(req, res) {
  //   const article = {
  //     _id: req.body._id,
  //     title: req.body.headline.main,
  //     url: req.body.web_url
  //   };
  //   db.Article
  //     .create(article)
  //     .then(dbArticle => res.json(dbArticle))
  //     .catch(err => res.status(422).json(err));
  // },
  // update: function(req, res) {
  //   db.Article
  //     .findOneAndUpdate({ _id: req.params.id }, req.body)
  //     .then(dbArticle => res.json(dbArticle))
  //     .catch(err => res.status(422).json(err));
  // },
  // remove: function(req, res) {
  //   db.Article
  //     .findById({ _id: req.params.id })
  //     .then(dbArticle => dbArticle.remove())
  //     .then(dbArticle => res.json(dbArticle))
  //     .catch(err => res.status(422).json(err));
  // }
};
