const router = require("express").Router();
const imdbRoutes = require("./imdb");

// Scraping route
router.use("/imdb", imdbRoutes);

module.exports = router;
