var fs = require('fs'),
	wolfram = require('wolfram').createClient(process.env.WOLFRAM_APPID);

//import all handlers
var handlers = {};
fs.readdirSync(__dirname+'/handlers').forEach(function(filename){
	if(/\.js$/.test(filename)){
		var handlerName = filename.toLowerCase().replace('.js', '');
		handlers[handlerName] = require('./handlers/'+filename);
	}
});

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
			this._askWolfram(options.humanQuery, function(strResult){
				var result = strResult,
					arrResult = result.split('\n'),
					details = null;

				if(arrResult.length > 1){
					result = 'Here\'s what I\'ve found';
					details = {
						definitions: arrResult
					};
				}
				
				callback({
					success: result !== null,
					type: 'response',
					message: result || 'Sorry, I do not know what you mean.',
					details: details,
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
		    	var strResult = result[1].subpods[0].value.replace(/\(.+\)/g, '')
		    	callback(strResult);
		    } else {
		    	callback(null);
		    }
		});
	}
	
};

module.exports = apisController;