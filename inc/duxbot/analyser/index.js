var utils = require('./utils'),
	queryHandlers = {
		event: require('./handlers/Event'),
		general: require('./handlers/General'),
		banking: require('./handlers/Banking'),
		show: require('./handlers/Show')
	};

module.exports = {

	analyse: function(query, cachedData, rawCallback){
		var self = this;

		//query ignore case and trim
		query = query.toLowerCase().trim();

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
					details: self.details,
					humanQuery: query
				});
			}
		};

		if(cachedData){
			//cachedData is here
			//go to category right away
			callback.category = cachedData.category;
			new queryHandlers[cachedData.category](null, query, callback, cachedData);
			return;
		}

		//first check
		//check category
		utils.triggerWordsSwitch({
			query: query,
			triggerWords: [{
				words: ['appointment', 'meeting', 'event'],
				handler: function(foundWord, query){
					callback.category = 'event';
					new queryHandlers.event(foundWord, query, callback);
				}
			}, {
				words: [
						'^hey$', '^who are you$', '^who made you$',
						'^what can (i|you) (do|say)$'
				],
				customRegex: true,
				handler: function(foundWord, query){
					callback.category = 'general';
					new queryHandlers.general(foundWord, query, callback);
				}
			}, {
				words: ['our current balance', 'banks in', 'a bank in'],
				handler: function(foundWord, query){
					callback.category = 'banking';
					new queryHandlers.banking(foundWord, query, callback);
				}
			}, {
				words: ['show me an image'],
				handler: function(foundWord, query){
					callback.category = 'show';
					new queryHandlers.show(foundWord, query, callback);
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