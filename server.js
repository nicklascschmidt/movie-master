require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

// Parse request body as JSON | body-parser for safety
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make public a static folder
app.use(express.static(path.join(__dirname, 'client')))

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);
require("./routes/scrape-routes")(app);

const db = require("./models");

const force = { force: false} // true resets db

db.sequelize.sync(force).then(function() {
  app.listen(PORT, function() {
    console.log(`🌎  ==> App running on PORT ${PORT}!`);
  });
});

module.exports = app;
