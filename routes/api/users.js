const router = require("express").Router();
const userController = require("../../controllers/userController");

// Matches with "/api/users/login"
router.route("/login")
  .get(userController.findOne);

// Matches with "/api/users/signup"
router.route("/signup")
  .post(userController.create);

module.exports = router;
