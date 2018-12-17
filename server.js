
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// // MLab / Mongoose stuff

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/reductressdb", { useNewUrlParser: true });


// send routes through the routes folder
require("./routes/html-routes")(app);


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  axios.get("http://reductress.com/popular").then(function(response) {

      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
  
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("div.box").each(function(i, element) {

        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find('article')
          .find('a')
          .attr('title');
        result.link = $(this)
          .find('article')
          .find('a')
          .attr('href');
        result.imgLink = $(this)
          .find('article')
          .find('a')
          .find('img')
          .attr('src');
        
        var isDuplicate = false;
        checkIfDuplicate();

        function checkIfDuplicate() {
          db.Article.findOne({ "title": result.title }, function(err, result) {
            if (err) {
              console.log('no titles found');
            }
        
            if (result) {
                // we have a result
                isDuplicate = true;
                console.log('this is a duplicate entry-- ',result.title);
            } else {
                // we don't
            }
          })
          .then(addArticle);
        }

        function addArticle() {
          if (!isDuplicate) {
            
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log('this is a new entry-- ',dbArticle.title);
                res.json(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
              });
          }
        }
        
        
      });
    });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");

}); // close app.get

app.get("/clear", function(req, res) {
  db.Article.remove()
    .then(function(articles) {
      res.json(articles);
    })
    .catch(function(err) {
      res.json(err);
    })
});


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});

