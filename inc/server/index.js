var express = require('express'),
	app = express();

var routes = require('./routes');

var server = {

	start: function(options){
		routes(app, options);
		app.listen(3000);
	}

};

module.exports = server;