var path = require('path');


module.exports = function(app) {
    // Main route (simple Hello World Message)
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname,'../','public','index.html'));
    });
    
}
