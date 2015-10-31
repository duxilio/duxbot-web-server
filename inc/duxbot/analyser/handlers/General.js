var utils = require('../utils');

var General = function(foundWord, query, callback, cachedData){
	this._callback = callback;
	this.checkForTriggerWords(query, cachedData);
};

General.prototype.checkForTriggerWords = function(query, cachedData){
	var self = this,
		callback = this._callback;

	//check method
	this._checkMethod(query, cachedData);

	//trigger callback
	callback.trigger();
};

General.prototype._checkMethod = function(query, cachedData){
	var self = this;

	if(cachedData){
		switch(cachedData.method){}
		return;
	}

	utils.triggerWordsSwitch({
		query: query,
		triggerWords: [{
			words: ['^hey$'],
			customRegex: true,
			handler: function(){
				self._callback.method = 'greeting';
			}
		}, {
			words: ['^who are you$', '^who$'],
			customRegex: true,
			handler: function(){
				self._callback.method = 'who_are_you';
			}
		}, {
			words: ['^who made you$'],
			customRegex: true,
			handler: function(){
				self._callback.method = 'who_made_you';
			}
		}, {
			words: ['^what can (i|you) (do|say)$'],
			customRegex: true,
			handler: function(){
				self._callback.method = 'what_can_you_do';
			}
		}],
		defaultAction: function(){
			self._callback.method = 'unknown';
		}
	});
};

module.exports = General;