var utils = {

	triggerWordsSwitch: function(options){
		var query = options.query,
			triggerWords = options.triggerWords,
			defaultAction = options.defaultAction;

		var wordFoundHandler = function(currObj, foundWord){
			//check if there is a function to handle
			//the triggerWord
			if(currObj.handler){
				currObj.handler(foundWord, query);
			} else {
				defaultAction();
			}
		};
		
		//loop triggerWords
		for(var i = triggerWords.length-1; i >= 0; i--){
			var currObj = triggerWords[i];

			//if triggerWord is found in query
			for(var j = currObj.words.length-1; j >= 0; j--){
				var currWord = currObj.words[j];

				if(this.checkStrForWord(currWord, query)){
					wordFoundHandler(currObj, currWord);
					return;
				}
			}
		}

		defaultAction();
	},

	checkStrForWord: function(word, str){
		return new RegExp(' '+word+' ').test(str) ||
			   new RegExp('^'+word+' ').test(str) ||
			   new RegExp(' '+word+'$').test(str);
	}

};

module.exports = utils;