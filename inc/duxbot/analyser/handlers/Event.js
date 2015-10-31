var utils = require('../utils');

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
			words: ['create', 'plan', 'schedule', 'have an appointment', 'have an event', 'have a meeting'],
			handler: function(){
				apisHelper.getContacts();
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

	//check invite emails
	var contacts = [{
		triggers: ['dave'],
		email: 'matti@duxilio.com'
	}, {
		triggers: ['me', 'myself'],
		email: 'koen@duxilio.com'
	}];

	if(!details.inviteEmails){
		var inviteEmails = [];

		//loop all contacts
		for(var i = 0; i < contacts.length; i++){
			var curr = contacts[i];

			//check if a triggerword can be found in the query
			//and if the email is not added yet
			for(var j = 0; j < curr.triggers.length; j++){
				if(query.indexOf(curr.triggers[j]) !== -1 &&
					inviteEmails.indexOf(curr.email) === -1){
					inviteEmails.push(curr.email);
				}
			}
		}
		details.inviteEmails = inviteEmails;
	}

	//time
	if(!details.time){
		match = query.match(/(\d+\s?(pm|am|p\.m\.|a\.m\.|o\'clock))/);
		if(match !== null){
			details.time = match[1];
		}
	}

	//date
	if(!details.date){
		match = query.match(/(tomorrow)/);
		if(match !== null){
			details.date = match[1];
		}
	}

	//name
	if(!details.name){
		match = query.match(/called ([^\s]+)/);
		if(match !== null){
			details.name = match[1];
		}
	}

	this._callback.details = details;
};

module.exports = Event;