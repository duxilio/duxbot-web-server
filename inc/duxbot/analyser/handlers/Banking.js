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
		switch(cachedData.method){
			case 'make_transfer':
				this._handleMakeTransfer(query, cachedData);
				break;
		}
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
		},{
			words: ['(latest|recent) transactions'],
			customRegex: true,
			handler: function(){
				self._callback.method = 'recent_transactions';
			}
		},{
			words: ['transfer [0-9]+'],
			customRegex: true,
			handler: function(){
				self._handleMakeTransfer(query, cachedData);
			}
		}],
		defaultAction: function(){
			self._callback.method = 'unknown';
		}
	});
};

Banking.prototype._handleMakeTransfer = function(query, cachedData){
	var details = cachedData && cachedData.details ? cachedData.details : {};

	this._callback.method = 'make_transfer';

	if(!details.amount){
		var match = query.match(/([0-9]+) (euro|dollar)/);
		if(match && match[1]){
			details.amount = match[1];
		}
	}

	if(!details.accountNumber){
		var match = query.match(/to (.+)/);
		console.log(match);
		if(match && match[1]){
			details.accountNumber = match[1];
		}
	}

	this._callback.details = details;
};

module.exports = Banking;