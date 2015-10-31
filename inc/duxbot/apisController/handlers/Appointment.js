var Appointment = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'schedule':
			this._scheduleAppointment(options.details, callback);
			break;
		default:
			callback({
				success: false,
				type: 'response',
				message: 'You want to do something with an Appointment, but I\'m not sure what',
				parsedDetails: {}
			});
			break;
	}
};

Appointment.prototype._scheduleAppointment = function(details){
	var callback = this._callback,
		neededProps = {
			'inviteEmails': 'Who would you like to invite?',
			'time': 'What time is the event?',
			'date': 'What date is the event?',
			'name': 'What is the name of the event?'
		};

	//start by check if everything is here
	for(key in neededProps){
		if(typeof details[key] === 'undefined'){
			//prop not here, ask for it
			callback({
				success: true,
				type: 'question',
				message: neededProps[key],
				parsedDetails: details
			});
			return;
		}
	};

};

module.exports = Appointment;