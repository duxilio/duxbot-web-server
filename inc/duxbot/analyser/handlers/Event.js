var utils = require('../utils');

var persons = [{
	trigger: 'paddington',
	email: 'matti@duxilio.com'
}, {
	trigger: 'me',
	email: 'koen@duxilio.com'
}];

var Event = function(foundWord, query, callback, cachedData){
	this._callback = callback;
	this.checkForTriggerWords(query, cachedData);
};

Event.prototype.checkForTriggerWords = function(query, cachedData){
	var self = this,
		callback = this._callback;

	//check method
	this._checkMethod(query, cachedData);

	//trigger callback
	callback.trigger();
};

Event.prototype._checkMethod = function(query, cachedData){
	var self = this;

	if(cachedData){
		switch(cachedData.method){
			case 'schedule':
				this._handleScheduleMethod(query, cachedData);
				break;
		}
		return;
	}

	utils.triggerWordsSwitch({
		query: query,
		triggerWords: [{
			words: ['create', 'plan', 'schedule', 'have an appointment'],
			handler: function(){
				self._handleScheduleMethod(query, cachedData);
			}
		}],
		defaultAction: function(){
			self._callback.method = 'unknown';
		}
	});
};

Event.prototype._handleScheduleMethod = function(query, cachedData){
	var details = cachedData && cachedData.details ? cachedData.details : {},
		match;

	this._callback.method = 'schedule';

	//check details
	if(!details.inviteEmails){
		var inviteEmails = [];
		for(var i = 0; i < persons.length; i++){
			var curr = persons[i];
			if(query.indexOf(curr.trigger) !== -1){
				//person is named in query
				inviteEmails.push(curr.email);
			}
		}
		details.inviteEmails = inviteEmails;
	}

	//time
	if(!details.time){
		match = query.match(/\d(pm|am)/);
		if(match !== null){
			details.time = match[0];
		}
	}

	//date
	if(!details.date){
		match = query.match(/(tomorrow)/);
		if(match !== null){
			details.date = match[0];
		}
	}

	//name
	if(!details.name){
		match = query.match(/called ([^\s]+)/);
		console.log('NAME', match);
		if(match !== null){
			details.name = match[0];
		}
	}

	this._callback.details = details;
};

module.exports = Event;