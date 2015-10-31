var utils = require('../utils');

var Event = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'schedule':
			utils.processNeedyMethod({
				neededProps: {
					inviteEmails: 'Who would you like to invite?',
					time: 'What time is the event?',
					date: 'What date is the event?',
					name: 'What is the name of the event?'
				},
				reqDetails: options.details,
				success: this._scheduleEvent.bind(this),
				resCallback: callback
			});
			break;
		default:
			callback({
				success: false,
				type: 'response',
				message: 'You want to do something with an Event, but I\'m not sure what',
				parsedDetails: {}
			});
			break;
	}
};

Event.prototype._scheduleEvent = function(reqDetails){
	var callback = this._callback;

	//if everything is there
	callback({
		success: true,
		type: 'response',
		message: 'Event Created',
		details: reqDetails,
		parsedDetails: reqDetails
	});
};

module.exports = Event;