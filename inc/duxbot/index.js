var logger = require('../logger'),
	analyser = require('./analyser'),
	apisController = require('./apisController'),
	utils = require('./utils'),
	Cache = require('./Cache');

var Duxbot = function(){
	this._parsedDetailsCache = new Cache();
};

Duxbot.prototype.analyse = function(query, requestId, callback){
	var	parsedDetailsCache = this._parsedDetailsCache,
		self = this;

	/**
	 * 1. analyse the query to something we can use
	 *    a.k.a human sentence to JSON
	 */
	analyser.analyse(query, function(analyserResult){
		/**
		 * 2. check if there was already data for the request
		 *    if so, add it to the details
		 */
		 var details = analyserResult.details;
		 if(requestId){
		 	var data = self._checkForCachedData(requestId)
		 	details = utils.extendObj(details, data);
		 }
		 analyserResult.details = details;

		 logger.log('IS_NEW_REQUEST', requestId === null, 'REQUEST_ID', requestId);

		 logger.log('ANALYSER_RESULT', analyserResult);

		 /**
		  * 3. put entire results object into the appropriate categoryHandler
		  */
		 apisController.process(analyserResult, function(handlerResult){
		 	//the api controller gives the final result and
		 	//tells us if its done or if it needs more info

		 	logger.log('HANDLER_RESULT', handlerResult);

		 	var output = handlerResult;

		 	if(output.type === 'question'){
		 		//its a question,
		 		//if there already is a requestId use it, otherwise
		 		//create a new one
		 		output.requestId = requestId || parsedDetailsCache.createNew(requestId);
		 	}

		 	logger.log('OUTPUT', output, '\n\n');
		 	callback(output);
		 });
	});
};

Duxbot.prototype._checkForCachedData = function(requestId){
	var parsedDetailsCache = this._parsedDetailsCache;

	//its an answer to
	//a question that was asked earlier
	return parsedDetailsCache.get(requestId);
};

module.exports = Duxbot;