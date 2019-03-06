// HTML Routes - only homepage needed for now

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname, '../','client','index.html'));
  });
};