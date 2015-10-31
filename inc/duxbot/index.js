var logger = require('../logger'),
	analyser = require('./analyser'),
	apisController = require('./apisController'),
	utils = require('./utils'),
	Cache = require('./Cache');

var Duxbot = function(){
	this._cache = new Cache();
};

Duxbot.prototype.analyse = function(query, requestId, callback){
	var	cache = this._cache,
		self = this,
		cachedData;

	/**
	 * 1. check if there was already data for the request
	 */
	 if(requestId){
	 	cachedData = self._checkForCachedData(requestId);
	 	if(cachedData === null){
 			//user gave an invalid requestId in the request
 			callback({
 				success: false,
 				message: 'that requestId was not found in the cache'
 			});
 			return;
 		}
	 }

	/**
	 * 2. analyse the query to something we can use
	 *    a.k.a human sentence to JSON
	 */
	analyser.analyse(query, cachedData, function(analyserResult){

	 	if(cachedData){
	 		//if there is cached data
	 		//add it to the results that will be passed
	 		//to the api handler
	 		analyserResult.category = cachedData.category;
	 		analyserResult.method = cachedData.method;
	 		analyserResult.details = utils.extendObj(analyserResult.details, cachedData.details);
	 	}

		 logger.log('IS_NEW_REQUEST', requestId === null, 'REQUEST_ID', requestId);
		 logger.log('ANALYSER_RESULT', analyserResult);

		 /**
		  * 3. put entire results object into the appropriate categoryHandler
		  */
		 apisController.process(analyserResult, function(handlerResult){
		 	//the api controller gives the final result and
		 	//tells us if its done or if it needs more info

		 	logger.log('HANDLER_RESULT', handlerResult);

		 	var output = {
		 		success: handlerResult.success,
		 		type: handlerResult.type,
		 		message: handlerResult.message
		 	};

		 	if(output.type === 'question'){
		 		//its a question,
		 		//if there already is a requestId use it, otherwise
		 		//create a new one and add the known details to the cache
		 		output.requestId = requestId || cache.createNew(requestId);

		 		var cacheItem = cache.get(output.requestId);
	 			cacheItem.category = analyserResult.category;
	 			cacheItem.method = analyserResult.method;
	 			cacheItem.details = analyserResult.details;
		 	} else if(output.type === 'response' && requestId) {
		 		//check if it belongs to a requestId
		 		//if so remove the record from cache as
		 		//the request has been resolved
		 		//(requestId are only there during the process of getting more info)
		 		logger.log('RECURSIVE_REQUEST_COMPLETED', requestId);
		 		cache.remove(requestId);
		 	}

		 	logger.log('OUTPUT', output, '\n\n');
		 	callback(output);
		 });
	});
};

Duxbot.prototype._checkForCachedData = function(requestId){
	var cache = this._cache;

	//its an answer to
	//a question that was asked earlier
	return cache.get(requestId);
};

module.exports = Duxbot;