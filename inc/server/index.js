var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

var routes = require('./routes');

var server = {

	start: function(options){
		this._setMiddleware();
		routes(app, options);
		app.listen(3000);
	},

	_setMiddleware: function(){
		app.use(bodyParser.json());
	}

};

module.exports = server;