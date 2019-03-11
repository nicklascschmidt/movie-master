const axios = require('axios');
const cheerio = require('cheerio');

// Methods
module.exports = {
  // Scrape IMDB, send array of IDs back to client
  scrapeImdb: async function(req,res) {
    let link = `https://www.imdb.com/search/title?groups=top_250&sort=user_rating,desc&start=${req.params.page}`;
    let arrayOfIds = await axios.get(link)
      .then( response => {
        // If req goes through, load HTML into cheerio and find the unique ID. Push into array, then return the array.
        if (response.status === 200) {
          let $ = cheerio.load(response.data);
          let imdbArray = [];
          $('div.lister-item').each( function(i, element) {
            imdbArray.push(
              $(this)
                .find('div.lister-item-image')
                .find('a')
                .find('img')
                .attr('data-tconst')
            );
          });
          return imdbArray
        }
      }
    );
    res.json(arrayOfIds)
  }
};
