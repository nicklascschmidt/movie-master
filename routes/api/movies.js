const router = require("express").Router();
const movieController = require("../../controllers/movieController");

// Matches with "/api/movies"
router.route("/")
  .get(movieController.findAll);
  // .post(movieController.create);

// Matches with "/api/movies/delete"
router.route("/delete/:id")
  .delete(movieController.remove);

// // Matches with "/api/articles/:id"
// router
//   .route("/:id")
//   .get(movieController.findById)
//   .put(movieController.update)
//   .delete(movieController.remove);

module.exports = router;
