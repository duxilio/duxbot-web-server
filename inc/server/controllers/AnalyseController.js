var Duxbot = require('../../duxbot');

var AnalyseController = function(app, options){
	this._app = app;
	this._options = options;
	this._duxbot = new Duxbot();
};

AnalyseController.prototype.analyse = function(query, requestId, callback){
	this._duxbot.analyse(query, requestId, callback);
};

module.exports = AnalyseController;