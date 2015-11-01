var http = require("http");

module.exports = {

	_apiUrl: '149.210.230.11',
	_apiPort: 9000,

    _base: function(type, path, data, callback){
    	var apiUrl = this._apiUrl,
    		apiPort = this._apiPort,
    		params = {
    			host: apiUrl,
    			path: path,
    			port: apiPort,
    			method: type,
    			headers: {
                    'Authorization': 'mvdweem@gmail.com',
                    'Content-Type': 'application/json'
                }
    		};

        var req = http.request(params, function(res){
            res.setEncoding('utf8');

            var data = '';
            res.on('data', function(d){
                data += d;
            });

            res.on('end', function(){
                var obj = JSON.parse(data);
                callback(obj);
            });
        });

        req.write(type === 'GET' ? '' : JSON.stringify(data));
        req.end();
    },

    get: function(path, callback){
        this._base('GET', path, null, callback);
    },

    post: function(path, data, callback){
        this._base('POST', path, data, callback);
    }

};