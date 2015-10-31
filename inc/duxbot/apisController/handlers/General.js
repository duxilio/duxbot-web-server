var General = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'greeting':
			callback({
				success: true,
				type: 'response',
				message: 'Hey',
				parsedDetails: {}
			});
			break;
		case 'who_are_you':
			callback({
				success: true,
				type: 'response',
				message: 'I am Sarah, your virtual office assistant',
				parsedDetails: {}
			});
			break;
		case 'what_can_you_do':
			callback({
				success: true,
				type: 'response',
				message: 'All sorts of stuff',
				details: {
					examples: [
						'who are you',
						'who made you',
						'me and dave have a meeting tomorrow',
						'plan a meeting',
						'me and paddington have an appointment at 2pm tomorrow called awesomeness4eva',
						'who was the first presedent of the United States',
						'tell me a joke',
						'show me an image of Harvey Specter',
						'show nearby banks',
						'show banks in Amsterdam'
					]
				},
				parsedDetails: {}
			});
			break;
		case 'who_made_you':
			callback({
				success: true,
				type: 'response',
				message: 'Koen and Matti, I hear those guys are awesome',
				parsedDetails: {}
			});
			break;
		default:
			callback({
				success: false,
				type: 'response',
				message: 'You want to do something General, but I\'m not sure what',
				parsedDetails: {}
			});
			break;
	}
};

module.exports = General;