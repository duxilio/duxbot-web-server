var utils = require('../utils');

var Banking = function(foundWord, query, callback, cachedData){
	this._callback = callback;
	this.checkForTriggerWords(query, cachedData);
};

Banking.prototype.checkForTriggerWords = function(query, cachedData){
	var self = this,
		callback = this._callback;

	//check method
	this._checkMethod(query, cachedData);

	//trigger callback
	callback.trigger();
};

Banking.prototype._checkMethod = function(query, cachedData){
	var self = this;

	if(cachedData){
		switch(cachedData.method){}
		return;
	}

	utils.triggerWordsSwitch({
		query: query,
		triggerWords: [{
			words: ['current balance'],
			handler: function(){
				self._callback.method = 'check_balance';
			}
		},{
			words: ['banks in', 'rob a bank in'],
			handler: function(){
				self._callback.method = 'show_banks_in';
			}
		}],
		defaultAction: function(){
			self._callback.method = 'unknown';
		}
	});
};

module.exports = Banking;