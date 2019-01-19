const cool = require('cool-ascii-faces');

module.exports = function(app) {
	app.get('/', function(req, res) {
		// res.sendFile(path.join(__dirname, '../','client','index.html'));
		res.sendFile(path.join(__dirname, '../','client','index.html'));
  });
  
  app.get('/cool', (req, res) => res.send(cool()))

};