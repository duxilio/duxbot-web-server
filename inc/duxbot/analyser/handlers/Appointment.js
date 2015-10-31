var utils = require('../utils');

var persons = [{
	trigger: 'paddington',
	email: 'matti@duxilio.com'
}, {
	trigger: 'me',
	email: 'koen@duxilio.com'
}];

var Appointment = function(foundWord, query, callback, cachedData){
	this._callback = callback;
	this.checkForTriggerWords(query, cachedData);
};

Appointment.prototype.checkForTriggerWords = function(query, cachedData){
	var self = this,
		callback = this._callback;

	//check method
	this._checkMethod(query, cachedData);

	//trigger callback
	callback.trigger();
};

Appointment.prototype._checkMethod = function(query, cachedData){
	var self = this;

	var handleScheduleMethod = function(){
		self._callback.method = 'schedule';
		var details = cachedData && cachedData.details ? cachedData.details : {};

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
			var match = query.match(/\dpm/);
			console.log('TIME MATCH', match);
			if(match !== null){
				details.time = match[0];
			}
		}

		self._callback.details = details;
	};

	if(cachedData){
		console.log(cachedData);
		switch(cachedData.method){
			case 'schedule':
				handleScheduleMethod();
				break;
		}
		return;
	}

	utils.triggerWordsSwitch({
		query: query,
		triggerWords: [{
			words: ['create', 'plan', 'schedule', 'have an appointment'],
			handler: handleScheduleMethod
		}],
		defaultAction: function(){
			self._callback.method = 'unknown';
		}
	});
};

module.exports = Appointment;