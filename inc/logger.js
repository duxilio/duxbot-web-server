var chalk = require('chalk');

var logger = {

	_getCurrTimeStr: function(){
		var date = new Date();
		return chalk.blue('['+date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear()+
		' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'] ');
	},

	_log: function(color, str){
		console.log(this._getCurrTimeStr()+chalk[color](str));
	},

	_parseArgs: function(args){
		var str = '';
		for(idx in args){
			var curr = args[idx];
			if(typeof curr === 'object'){
				curr = JSON.stringify(curr, null, 4);
			}
			str += curr+' ';
		}
		return str;
	},
	
	log: function(){
		var str = this._parseArgs(arguments);
		this._log('white', str);
	},

	warn: function(){
		var str = this._parseArgs(arguments);
		this._log('yellow', str);
	},

	error: function(){
		var str = this._parseArgs(arguments);
		this._log('red', str);
	}

};

module.exports = logger;