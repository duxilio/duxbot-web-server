var apisHelper = require('../../apisHelper');

var Banking = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'check_balance':
			apisHelper.get('/balance', function(data){
				var accounts = data.ConfiguredAccounts.Account,
					msg = 'you have ';
				
				accounts.forEach(function(accDetails, idx){
					msg += accDetails.Balance+' euro on your '+accDetails.ProductName;
					if(idx !== accounts.length-1){
						msg += ' and ';
					}
				});

				callback({
					success: true,
					type: 'response',
					message: msg,
					parsedDetails: {}
				});
			});
			break;
		default:
			callback({
				success: false,
				type: 'response',
				message: 'You want to do something with Banking, but I\'m not sure what',
				parsedDetails: {}
			});
			break;
	}
};

module.exports = Banking;