var db = require('../models');

module.exports = function(app) {

  // app.get("/api/all", function(req, res) {
  //   User.findAll({}).then(function(results) {
  //     res.json(results);
  //   });
  // });


  // Add a user
  app.post('/api/new-user', function(req, res) {
    // console.log('req.body',req.body);
    db.User.create({
      username: req.body.username,
      password: req.body.password
    }).then(function() {
      res.end();
    });

  });

  // Check login credentials
  app.get('/api/find-user', function(req,res) {
    // console.log('req.query',req.query);
    db.User.findOne({
      where: {
        username: req.query.username,
        password: req.query.password
      }
    }).then(data => {
      res.json(data);
    }).catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
  });

};