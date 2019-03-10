// Routes for interacting with the DB.

const db = require('../models');

module.exports = function(app) {

  // Add a movie to to-do list
  app.post('/api/add-movie-to-watchlist', function(req,res) {
    // console.log('req.body',req.body);
    db.Movie.create(
      req.body
    )
      .then( () => {
        res.end();
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      }
    )
  })

  // Get all movies
  app.get('/api/get-all-movies', function(req,res) {
    // console.log('req.query',req.query);
    db.Movie.findAll({
      where: req.query
    })
      .then( data => {
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      }
    )
  })
  
  // Get one movie
  app.get('/api/get-movie', function(req,res) {
    console.log('req.body',req.body);
    console.log('req.query',req.query);

    db.Movie.findOne({
      where: {
        title: req.query.title
      }
    })
      .then( () => {
        res.end();
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      }
    )
  })

  // Change the user rating
  app.put('/api/update-user-rating', function(req,res) {
    // console.log('req.body',req.body);

    db.Movie.update({
      userRating: req.body.rating
    },{
      where: {
        id: req.body.id
      }
    })
      .then( data => {
        // console.log(`updated ${data} record`)
      })
      .catch( err => console.log('err',err))
  })

  // Mark a movie watched or unwatched
  app.put('/api/update-isWatched', function(req,res) {
    // console.log('req.body',req.body);

    let updateWatched = req.body.isWatched;
    let opposite = updateWatched === 'true' ? false : true;

    db.Movie.update({
      isWatched: opposite
    },{
      where: {
        id: req.body.id
      }
    })
      .then( () => res.send(true))
      .catch( err => console.log('err',err))
  })

  app.get('/api/check-if-exists', function(req,res) {
    // console.log('req.query',req.query);
    let title = req.query.title;
    let userId = req.query.UserId;
    db.Movie.findOne({
      where: {
        title: title,
        UserId: userId
      }
    })
      .then( data => {
        if (data !== null) {
          res.send(true);
        } else {
          res.send(false);
        }
      })
      .catch(err => {
        console.log(err);
        res.end();
      }
    )
  })

  // Delete from DB
  app.post('/api/remove-movie-from-db', function(req,res) {
    console.log('req.body',req.body);

    db.Movie.destroy({
      where: req.body
    })
      .then( () => res.send(true))
      .catch( err => console.log('err',err))
  })
};