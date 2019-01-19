const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {

  app.get("/scrape/imdb", async function(req, res) {
    let imdbArray = [];
    let array = await axios.get(`https://www.imdb.com/search/title?groups=top_250&sort=user_rating,desc&start=${req.query.pageStart}`).then(function(response) {
      if (response.status === 200) {
        var $ = cheerio.load(response.data);
        $("div.lister-item").each(function(i, element) {
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
    });
  
    res.send(array);
  });
};