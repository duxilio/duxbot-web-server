var apisController = {

	process: function(options, callback){
		console.log('API_CONTROLLER', options);
		callback({
			success: true,
			type: 'question',
			message: 'I need a time',
			parsedDetails: {}
		});
	}
	
};

module.exports = apisController;