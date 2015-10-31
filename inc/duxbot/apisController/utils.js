var utils = {

	processNeedyMethod: function(options){
		//neededProps, reqDetails, processFunc, resCallback
		if(this._checkProperties(options.neededProps, options.reqDetails, options.resCallback)){
			options.success(options.reqDetails);
		}
	},
	
	_checkProperties: function(neededProps, reqDetails, resCallback){

		//start by check if everything is here
		for(key in neededProps){
			if(typeof reqDetails[key] === 'undefined'){
				//prop not here, ask for it
				resCallback({
					success: true,
					type: 'question',
					message: neededProps[key],
					parsedDetails: reqDetails
				});
				return false;
			}
		};

		return true
	}

};

module.exports = utils;