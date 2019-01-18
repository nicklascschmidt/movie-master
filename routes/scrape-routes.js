const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {

  app.get("/scrape/imdb", function(req, res) {
    axios.get("https://www.imdb.com/search/title?groups=top_250&sort=user_rating").then(function(response) {

    // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
  
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("div.lister-item").each(function(i, element) {

        // console.log('i',i);
        // console.log('element',element)

        // Save an empty result object
        // var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        let test = $(this)
          .find('div.lister-item-content')
          .find('h3.lister-item-header')
          .find('a')
          .attr('href')

        console.log('test',test);
          
        // result.link = $(this)
        //   .find('article')
        //   .find('a')
        //   .attr('href');
        // result.imgLink = $(this)
        //   .find('article')
        //   .find('a')
        //   .find('img')
        //   .attr('src');
        
        // var isDuplicate = false;
        // checkIfDuplicate();

        // function checkIfDuplicate() {
        //   db.Article.findOne({ "title": result.title }, function(err, result) {
        //     if (err) {
        //       console.log('no titles found');
        //     }
        
        //     if (result) {
        //         // we have a result
        //         isDuplicate = true;
        //         console.log('this is a duplicate entry-- ',result.title);
        //     } else {
        //         // we don't
        //     }
        //   })
        //   .then(addArticle);
        // }

        // function addArticle() {
        //   if (!isDuplicate) {
            
        //     // Create a new Article using the `result` object built from scraping
        //     db.Article.create(result)
        //       .then(function(dbArticle) {
        //         // View the added result in the console
        //         console.log('this is a new entry-- ',dbArticle.title);
        //         res.json(dbArticle);
        //       })
        //       .catch(function(err) {
        //         // If an error occurred, send it to the client
        //         res.json(err);
        //       });
        //   }
        // }
        });
      });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  
  }); // close app.get



  
};