// Entry point of the application.
// Set up server, import routes, sync DB.

require('dotenv').config();

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");

// Bring in routes, initialize express, define dev port
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3000;

// Parse request body as JSON (for AJAX reqs) | body-parser for safety
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('client'));
app.use(routes);

const db = require("./models");

const forceBool = { force: false} // true resets db
db.sequelize.sync(forceBool).then(function() {
  app.listen(PORT, function() {
    console.log(`🌎  ==> App running on PORT ${PORT}!`);
  });
});
