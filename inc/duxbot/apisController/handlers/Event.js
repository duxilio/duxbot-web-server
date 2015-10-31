var neededProps = {

	schedule: {
		inviteEmails: 'Who would you like to invite?',
		time: 'What time is the event?',
		date: 'What date is the event?',
		name: 'What is the name of the event?'
	}

};

var Event = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'schedule':
			this._processMethod('schedule', options.details, this._scheduleEvent);
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

Event.prototype._processMethod = function(methodName, reqDetails, processFunc){
	if(this._checkProperties(neededProps[methodName], reqDetails)){
		processFunc.call(this, reqDetails);
	}
};

Event.prototype._checkProperties = function(neededProps, reqDetails){
	var callback = this._callback;

	//start by check if everything is here
	for(key in neededProps){
		if(typeof reqDetails[key] === 'undefined'){
			//prop not here, ask for it
			callback({
				success: true,
				type: 'question',
				message: neededProps[key],
				parsedDetails: reqDetails
			});
			return false;
		}
	};

	return true
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