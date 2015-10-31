var wolfram = require('wolfram').createClient(process.env.WOLFRAM_APPID);

var handlers = {
	appointment: require('./handlers/appointment')
};

var apisController = {

	process: function(options, rawCallback){
		var handler = handlers[options.category];

		var callback = function(options){
			var requiredProps = ['success', 'type', 'message', 'parsedDetails'];
			requiredProps.forEach(function(requiredProp){
				if(typeof options[requiredProp] === 'undefined'){
					throw new Error('prop '+requiredProp+' missing from result');
				}
			});

			rawCallback(options);
		};

		if(typeof handler !== 'undefined'){
			//category is known
			new handler(options, callback);
		} else {
			//category is unknown
			//ask wolfram
			this._askWolfram(options.humanQuery, function(result){
				callback({
					success: result !== null,
					type: 'response',
					message: result || 'Sorry, I do not know what you mean.',
					parsedDetails: null
				});
			});
		}
	},

	_askWolfram: function(query, callback){
		var self = this;
		wolfram.query(query, function(err, result){
		    if(err) throw err;

		    if(result[1] && result[1].subpods[0]){
		    	callback(result[1].subpods[0].value.replace(/\(.+\)/g, ''));
		    } else {
		    	callback(null);
		    }
		});
	}
	
};

module.exports = apisController;