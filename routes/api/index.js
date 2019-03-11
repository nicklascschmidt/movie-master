const router = require("express").Router();
const movieRoutes = require("./movies");
const userRoutes = require("./users");

// Routes
router.use("/movies", movieRoutes);
router.use("/users", userRoutes);

module.exports = router;
