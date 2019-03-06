const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
  
  // Scrape IMDB page and send back an array of movies to the client.
  app.get("/scrape/imdb", async function(req, res) {
    let link = `https://www.imdb.com/search/title?groups=top_250&sort=user_rating,desc&start=${req.query.pageStart}`;
    let imdbArray = [];
    let arrayOfIds = await axios.get(link)
      .then( response => {
        if (response.status === 200) {
          // Load HTML into cheerio and find the unique ID
          let $ = cheerio.load(response.data);
          $('div.lister-item').each( function(i, element) {
            imdbArray.push(
              $(this)
                .find('div.lister-item-image')
                .find('a')
                .find('img')
                .attr('data-tconst')
            )
          })
          return imdbArray
        }
      }
    );
  
    res.send(arrayOfIds);
  });
};