const router = require("express").Router();
const userController = require("../../controllers/userController");

// Matches with "/api/users"...
router.route("/login")
  .get(userController.findOne);
  
router.route("/signup")
  .post(userController.create);

module.exports = router;
