var Cache = function(){
	this._cache = {};
};

Cache.prototype.createNew = function(){
	var requestId = this._genGUID();
	this._cache[requestId] = {};
	return requestId;
};

Cache.prototype.get = function(requestId){
	var item = this._cache[requestId];
	return (typeof item !== 'object') ? null : item;
};

Cache.prototype.remove = function(requestId){
    if(typeof this._cache[requestId] === 'object'){
        delete this._cache[requestId];
    }
};

Cache.prototype._genGUID = function(length){
    if(typeof length !== 'number') length = 41;

    // Math.random returns number with length between 16 and 18 chars

    //if length below 16 do in one go
    if(length <= 16){
        return Math.random().toString(36).substring(2,length+2);
    }

    //else calculate how many iterations we need
    var iterations = Math.ceil(length / 16),
        outputStr = '';
    
    for(var i = 0; i < iterations; i++){
        outputStr += Math.random().toString(36).substring(2,18);
    }

    //correct length if it's too high
    if(outputStr.length > length) outputStr = outputStr.substring(0,length);

    return outputStr;
};

module.exports = Cache;