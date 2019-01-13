const express = require("express");
const bodyParser = require("body-parser");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

// Parse request body as JSON | body-parser for safety
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make public a static folder
app.use(express.static("public"));

require("./routes/html-routes")(app);


// only force=true if we want to add columns or reset the data in the db
// const force = { force: false}

// db.sequelize.sync(force).then(function() {
  app.listen(PORT, function() {
    console.log(`🌎  ==> App running on PORT ${PORT}!`);
  });
// });

module.exports = app;
