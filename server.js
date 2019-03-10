// Entry point of the application.
// Set up server, import routes, sync DB.

require('dotenv').config();

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

// Parse request body as JSON | body-parser for safety
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make client and assets static folders
app.use('/assets',express.static(path.join(__dirname, '/client/assets')));
app.use(express.static(path.join(__dirname, '/client')));

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);
require("./routes/scrape-routes")(app);

const db = require("./models");

const forceBool = { force: false} // true resets db

db.sequelize.sync(forceBool).then(function() {
  app.listen(PORT, function() {
    console.log(`🌎  ==> App running on PORT ${PORT}!`);
  });
});

module.exports = app;
