var utils = require('./utils'),
	queryHandlers = {
		Lights: require('./handlers/lights')
	};

module.exports = {

	analyse: function(query, rawCallback){
		var self = this;

		var callback = {
			category: '',
			method: '',
			details: {},
			trigger: function(){
				var self = this;

				//when there is a result,
				//send it back as the response to the
				//callback given in the method
				rawCallback({
					category: self.category,
					method: self.method,
					details: self.details
				});
			}
		};

		//first check
		//check category
		utils.triggerWordsSwitch({
			query: query,
			triggerWords: [{
				words: ['lights', 'light'],
				handler: function(foundWord, query){
					callback.category = 'lights';
					new queryHandlers.Lights(foundWord, query, callback);
				}
			}],
			defaultAction: function(){
				//no matches for any of the words above
				callback.category = 'unknown';
				callback.trigger('unknown');
			}
		});
	}

};