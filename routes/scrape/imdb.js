const router = require("express").Router();
const scrapeController = require("../../controllers/scrapeController");

// Matches with "/scrape/imdb________"
router.route("/:page")
  .get(scrapeController.scrapeImdb);

module.exports = router;
