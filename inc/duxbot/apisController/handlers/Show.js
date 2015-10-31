var reqHelper = require('../../reqHelper');

var Show = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'show_img':
			var queryMatch = options.humanQuery.match(/show me (a|an) (image|picture|photo) of (.+)/);
			
			console.log(queryMatch);

			if(queryMatch && queryMatch[3]){
				var query = queryMatch[3];

				reqHelper.get('/giphy/'+encodeURIComponent(query), function(res){
					if(res.data){
						callback({
							success: true,
							type: 'response',
							message: 'check it out',
							details: {
								images: [res.data]
							},
							parsedDetails: {}
						});
					} else {
						callback({
							success: true,
							type: 'response',
							message: 'wasn\'t able to get an image matching '+query,
							parsedDetails: {}
						});
					}
				});

			} else {
				callback({
					success: true,
					type: 'response',
					message: 'I\'m not sure what it is you want me to show you',
					parsedDetails: {}
				});
			}
			break;
		default:
			callback({
				success: false,
				type: 'response',
				message: 'You want me to show you something, but I\'m not sure what',
				parsedDetails: {}
			});
			break;
	}
};

module.exports = Show;