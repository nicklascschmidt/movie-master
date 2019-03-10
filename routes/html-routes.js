// HTML Routes - catchall routes to login page (index)
const path = require('path');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../','client','index.html'));
  });
  app.get('/my-movies', function(req, res) {
		res.sendFile(path.join(__dirname, '../','client','my-movies.html'));
  });
  app.get('/search', function(req, res) {
		res.sendFile(path.join(__dirname, '../','client','search.html'));
  });
};