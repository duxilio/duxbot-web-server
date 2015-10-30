var utils = require('../utils');

var Lights = function(foundWord, query, callback){
	this._callback = callback;
	this.checkForTriggerWords(query);
};

Lights.prototype.checkForTriggerWords = function(query){
	var self = this,
		callback = this._callback;

	utils.triggerWordsSwitch({
		query: query,
		triggerWords: [{
			words: ['off'],
			handler: function(){
				callback.method = 'turn_off';
			}
		}, {
			words: ['on'],
			handler: function(){
				callback.method = 'turn_on';
			}
		}, {
			words: ['dim'],
			handler: function(){
				callback.method = 'dim';
			}
		}],
		defaultAction: function(){
			callback.method = 'unknown';
		}
	});

	callback.trigger();
};

module.exports = Lights;