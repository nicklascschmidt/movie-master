const router = require("express").Router();
const movieController = require("../../controllers/movieController");

// Matches with "/api/movies________"

router.route("/")
  .get(movieController.findAll);

router.route("/add")
  .post(movieController.create);

router.route("/find")
  .get(movieController.findOne);

router.route("/delete/:id")
  .delete(movieController.remove);

router.route("/update-watched/:id")
  .put(movieController.updateWatched);
  
router.route("/update-rating/:id")
  .put(movieController.updateRating);

module.exports = router;
