const db = require("../models");

// Defining methods for the articleController
module.exports = {
  findAll: function(req, res) {
    console.log('\n\n\nreq.query',req.query,'\n\n\n')
    db.Movie
      .find(req.query)
      // .sort({ date: -1 })
      // .then(dbMovie => res.json(dbMovie))
      .then(dbMovie => res.json(dbMovie))
      .catch(err => res.status(422).json(err));
  },
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
