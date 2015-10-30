var express = require('express'),
	app = express();

var routes = require('./routes');

var server = {

	start: function(port){
		routes(app);
		app.listen(port);
	}

};

module.exports = server;