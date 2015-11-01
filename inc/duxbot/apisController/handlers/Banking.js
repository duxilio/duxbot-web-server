var reqHelper = require('../../reqHelper'),
	utils = require('../utils');

var Banking = function(options, callback){
	this._callback = callback;

	//check method
	switch(options.method){
		case 'check_balance':
			//get balance 
			reqHelper.get('/balance', function(data){

				//construct human friendly result
				var accounts = data.ConfiguredAccounts.Account,
					msg = 'you have ';
				
				accounts.forEach(function(accDetails, idx){
					msg += accDetails.Balance+' euro on your '+accDetails.ProductName.toLowerCase();
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
		case 'show_banks_in':
			var cityMatch = options.humanQuery.match(/in ([^\s]+)/);
			if(cityMatch && cityMatch[1]){
				var cityName = cityMatch[1];

				reqHelper.get('/banks/'+cityName, function(banks){
					if(banks.length < 1){
						//no banks found
						callback({
							success: true,
							type: 'response',
							message: 'could not find any banks in '+cityName,
							parsedDetails: {}
						});
						return;
					}

					//filter fields
					banks.forEach(function(bank, idx){
						banks[idx] = {
							address: bank.address,
							telephone: bank.telephone
						};
					});

					callback({
						success: true,
						type: 'response',
						message: 'Here are the first '+(banks.length < 3 ? banks.length : 3)+' Rabobanks',
						details: {
							banks: banks
						},
						parsedDetails: {}
					});
				});
			} else {
				callback({
					success: true,
					type: 'response',
					message: 'please specify a city',
					parsedDetails: {}
				});
			}
			break;
		case 'recent_transactions':
			reqHelper.get('/transaction/latest', function(res){
				res.forEach(function(item, idx){
					res[idx] = {
						location: item.beneficiaryAccountname,
						price: item.amount+' '+item.currency,
						date: item.valueDate,
						label: item.label
					};
				});

				callback({
					success: true,
					type: 'response',
					message: 'here are your 3 latest transactions',
					details: {
						transactions: res
					},
					parsedDetails: {}
				});
			});
			break;
		case 'prepare_transfer':
			utils.processNeedyMethod({
				neededProps: {
					amount: 'What is the amount you would like to transfer?',
					contactName: 'What is the name of the contact you would like to transfer the money to?',
					description: 'What would you like to be the description?'
				},
				reqDetails: options.details,
				success: this._prepareTransfer.bind(this),
				resCallback: callback
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

Banking.prototype._prepareTransfer = function(options){
	var callback = this._callback;

	//get contacts
	reqHelper.get('/addressbook', function(contacts){
		var contactDetails;

		//search for contact match
		contacts.forEach(function(contact){
			if(contact.username.toLowerCase() === options.contactName){
				contactDetails = contact;
			}
		});

		//contact not found
		if(!contactDetails){
			callback({
				success: false,
				type: 'response',
				message: 'contact '+options.contactName+' not found in your Rabobank contactsbook',
				details: null,
				parsedDetails: {}
			});
			return;
		}

		var transferOptions = {
		    amount: Number(options.amount),
		    fromAccount: "NL43RABO0119588404",
		    toAccount: contactDetails.iban_payment,
		    toName: contactDetails.username,
		    Description: options.description
		};

		//if contact is found
		//transfer tha moneyz
		reqHelper.post('/transfer', transferOptions,
		function(res){
			if(res.transactionkey){
				//success
				callback({
					success: true,
					type: 'response',
					message: 'I prepared the following transfer for you',
					details: transferOptions,
					parsedDetails: transferOptions
				});
			}
		});

	});
};

module.exports = Banking;